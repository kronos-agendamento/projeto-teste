package sptech.projetojpa1.service//package sptech.projetojpa1.service
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import sptech.projetojpa1.dominio.Item
import sptech.projetojpa1.dominio.Pacote
import sptech.projetojpa1.dto.pacote.PacoteDTO
import sptech.projetojpa1.dto.pacote.PacoteRequestDTO
import sptech.projetojpa1.dto.pacote.PacoteResponseDTO
import sptech.projetojpa1.repository.EspecificacaoRepository
import sptech.projetojpa1.repository.ItemRepository
import sptech.projetojpa1.repository.PacoteRepository

@Service
class PacoteService(
    @Autowired private val pacoteRepository: PacoteRepository,
    @Autowired private val itemRepository: ItemRepository,
    @Autowired private val especificacaoRepository: EspecificacaoRepository
) {

    @Transactional
    fun criarPacote(pacoteRequestDTO: PacoteRequestDTO): PacoteDTO {
        val pacote = Pacote(
            nome = pacoteRequestDTO.nome,
            descontoColocacao = pacoteRequestDTO.descontoColocacao,
            descontoManutencao = pacoteRequestDTO.descontoManutecao
        )
        val pacoteSalvo = pacoteRepository.save(pacote)

        val itens = pacoteRequestDTO.itens.map {
            val especificacao = especificacaoRepository.findById(it.especificacaoId).orElseThrow { RuntimeException("Especificação não encontrada") }
            val item = Item(
                pacote = pacoteSalvo,
                servico = it.especificacaoId,
                quantidade = it.quantidade
            )
            itemRepository.save(item)
            PacoteDTO.ItemDTO(
                especificacaoId = it.especificacaoId,
                especificacao = especificacao.especificacao ?: "N/A",
                quantidade = it.quantidade,
                precoColocacao = especificacao.precoColocacao ?: 0.0,
                precoManutencao = especificacao.precoManutencao ?: 0.0
            )
        }

        val valores = calcularValores(itens, pacoteRequestDTO.descontoColocacao, pacoteRequestDTO.descontoManutecao)

        return PacoteDTO(
            nome = pacoteRequestDTO.nome,
            itens = itens,
            descontoColocacao = pacoteRequestDTO.descontoColocacao,
            descontoManutencao = pacoteRequestDTO.descontoManutecao,
            valorTotalColocacao = valores.first,
            valorTotalManutencao = valores.second,
            valorTotal = valores.first + valores.second
        )
    }

    fun listarPacotes(): List<PacoteResponseDTO> {
        val pacotes = pacoteRepository.findAll()
        return pacotes.map { pacote ->
            val itens = itemRepository.findByPacoteId(pacote.id).map { item ->
                val especificacao = especificacaoRepository.findById(item.servico).orElseThrow { RuntimeException("Especificação não encontrada") }
                PacoteDTO.ItemDTO(
                    especificacaoId = item.servico,
                    especificacao = especificacao.especificacao ?: "N/A",
                    quantidade = item.quantidade,
                    precoColocacao = especificacao.precoColocacao ?: 0.0,
                    precoManutencao = especificacao.precoManutencao ?: 0.0
                )
            }
            val valores = calcularValores(itens, pacote.descontoColocacao, pacote.descontoManutencao)
            PacoteResponseDTO(
                id = pacote.id,
                nome = pacote.nome,
                itens = itens,
                descontoColocacao = pacote.descontoColocacao,
                descontoManutencao = pacote.descontoManutencao,
                valorTotalColocacao = valores.first,
                valorTotalManutencao = valores.second,
                valorTotal = valores.first + valores.second
            )
        }
    }

    fun atualizarItensPorNomePacote(nomePacote: String, novosItens: List<PacoteRequestDTO.ItemDTO>) {
        val pacotes = pacoteRepository.findByNomeContains(nomePacote)
        pacotes.forEach { pacote ->
            val itensAtuais = itemRepository.findByPacoteId(pacote.id)
            itemRepository.deleteAll(itensAtuais)
            novosItens.forEach { itemDTO ->
                val especificacao = especificacaoRepository.findById(itemDTO.especificacaoId).orElseThrow { RuntimeException("Especificação não encontrada") }
                val item = Item(
                    pacote = pacote,
                    servico = itemDTO.especificacaoId,
                    quantidade = itemDTO.quantidade
                )
                itemRepository.save(item)
            }
        }
    }

    fun atualizarDescontosPorNomePacote(nomePacote: String, descontoColocacao: Double?, descontoManutencao: Double?) {
        val pacotes = pacoteRepository.findByNomeContains(nomePacote)
        pacotes.forEach { pacote ->
            descontoColocacao?.let { pacote.descontoColocacao = it }
            descontoManutencao?.let { pacote.descontoManutencao = it }
            pacoteRepository.save(pacote)
        }
    }

    fun atualizarNomePacote(idPacote: Int, novoNome: String) {
        val pacote = pacoteRepository.findById(idPacote).orElseThrow { RuntimeException("Pacote não encontrado") }
        pacote.nome = novoNome
        pacoteRepository.save(pacote)
    }

    fun deletarPacotesPorId(id: Int) {
        // Verifique se existem itens associados ao pacote
        val itensAssociados = itemRepository.findByPacoteId(id)
        if (itensAssociados.isNotEmpty()) {
            // Se houver itens associados, remova-os primeiro
            itemRepository.deleteAll(itensAssociados)
        }
        // Agora você pode excluir o pacote
        pacoteRepository.deleteById(id)
    }

    fun listarPacotesPorDescontoColocacaoEntre(min: Double, max: Double): List<PacoteDTO> {
        val pacotes = pacoteRepository.findByDescontoColocacaoBetween(min, max)
        return pacotes.map { pacote ->
            val itens = itemRepository.findByPacoteId(pacote.id).map { item ->
                val especificacao = especificacaoRepository.findById(item.servico).orElseThrow { RuntimeException("Especificação não encontrada") }
                PacoteDTO.ItemDTO(
                    especificacaoId = item.servico,
                    especificacao = especificacao.especificacao ?: "N/A",
                    quantidade = item.quantidade,
                    precoColocacao = especificacao.precoColocacao ?: 0.0,
                    precoManutencao = especificacao.precoManutencao ?: 0.0
                )
            }
            val valores = calcularValores(itens, pacote.descontoColocacao, pacote.descontoManutencao)
            PacoteDTO(
                nome = pacote.nome,
                itens = itens,
                descontoColocacao = pacote.descontoColocacao,
                descontoManutencao = pacote.descontoManutencao,
                valorTotalColocacao = valores.first,
                valorTotalManutencao = valores.second,
                valorTotal = valores.first + valores.second
            )
        }
    }

    fun listarPacotesPorDescontoManutencaoEntre(min: Double, max: Double): List<PacoteDTO> {
        val pacotes = pacoteRepository.findByDescontoManutencaoBetween(min, max)
        return pacotes.map { pacote ->
            val itens = itemRepository.findByPacoteId(pacote.id).map { item ->
                val especificacao = especificacaoRepository.findById(item.servico).orElseThrow { RuntimeException("Especificação não encontrada") }
                PacoteDTO.ItemDTO(
                    especificacaoId = item.servico,
                    especificacao = especificacao.especificacao ?: "N/A",
                    quantidade = item.quantidade,
                    precoColocacao = especificacao.precoColocacao ?: 0.0,
                    precoManutencao = especificacao.precoManutencao ?: 0.0
                )
            }
            val valores = calcularValores(itens, pacote.descontoColocacao, pacote.descontoManutencao)
            PacoteDTO(
                nome = pacote.nome,
                itens = itens,
                descontoColocacao = pacote.descontoColocacao,
                descontoManutencao = pacote.descontoManutencao,
                valorTotalColocacao = valores.first,
                valorTotalManutencao = valores.second,
                valorTotal = valores.first + valores.second
            )
        }
    }

    fun listarPacotesPorNome(nomePacote: String): List<PacoteDTO> {
        val pacotes = pacoteRepository.findByNomeContains(nomePacote)
        return pacotes.map { pacote ->
            val itens = itemRepository.findByPacoteId(pacote.id).map { item ->
                val especificacao = especificacaoRepository.findById(item.servico).orElseThrow { RuntimeException("Especificação não encontrada") }
                PacoteDTO.ItemDTO(
                    especificacaoId = item.servico,
                    especificacao = especificacao.especificacao ?: "N/A",
                    quantidade = item.quantidade,
                    precoColocacao = especificacao.precoColocacao ?: 0.0,
                    precoManutencao = especificacao.precoManutencao ?: 0.0
                )
            }
            val valores = calcularValores(itens, pacote.descontoColocacao, pacote.descontoManutencao)
            PacoteDTO(
                nome = pacote.nome,
                itens = itens,
                descontoColocacao = pacote.descontoColocacao,
                descontoManutencao = pacote.descontoManutencao,
                valorTotalColocacao = valores.first,
                valorTotalManutencao = valores.second,
                valorTotal = valores.first + valores.second
            )
        }
    }

    private fun calcularValores(itens: List<PacoteDTO.ItemDTO>, descontoColocacao: Double, descontoManutencao: Double): Pair<Double, Double> {
        val totalColocacao = itens.sumOf { it.precoColocacao * it.quantidade } * (1 - descontoColocacao / 100)
        val totalManutencao = itens.sumOf { it.precoManutencao * it.quantidade } * (1 - descontoManutencao / 100)
        return Pair(totalColocacao, totalManutencao)
    }
}

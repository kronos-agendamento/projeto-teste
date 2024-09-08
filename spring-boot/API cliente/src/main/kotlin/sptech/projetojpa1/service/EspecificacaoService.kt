package sptech.projetojpa1.service

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import sptech.projetojpa1.domain.Especificacao
import sptech.projetojpa1.dto.especificacao.EspecificacaoDTO
import sptech.projetojpa1.repository.EspecificacaoRepository
import sptech.projetojpa1.repository.ProcedimentoRepository

@Service
class EspecificacaoService(
    @Autowired private val repository: EspecificacaoRepository,
    @Autowired private val procedimentoRepository: ProcedimentoRepository
) {
    fun criarEspecificacao(dto: EspecificacaoDTO): Especificacao {
        val procedimento = procedimentoRepository.findById(dto.procedimento!!)
            .orElseThrow { IllegalArgumentException("Procedimento não encontrado com o ID: ${dto.procedimento}") }

        val especificacao = Especificacao(
            especificacao = dto.especificacao,
            precoColocacao = dto.precoColocacao,
            precoManutencao = dto.precoManutencao,
            precoRetirada = dto.precoRetirada,
            tempoColocacao = dto.tempoColocacao!!,
            tempoManutencao = dto.tempoManutencao!!,
            tempoRetirada = dto.tempoRetirada!!,
            foto = null,
            procedimento = procedimento
        )

        return repository.save(especificacao)
    }

    fun listarEspecificacao(): List<Especificacao> = repository.findAll()

    fun listarEspecificacaoPorId(id: Int): Especificacao? = repository.findById(id).orElse(null)

    fun atualizarEspecificacao(id: Int, dto: EspecificacaoDTO): Especificacao? {
        val especificacaoExistente = repository.findById(id).orElse(null) ?: return null

        dto.especificacao?.let { especificacaoExistente.especificacao = it }
        dto.precoColocacao?.let { especificacaoExistente.precoColocacao = it }
        dto.precoManutencao?.let { especificacaoExistente.precoManutencao = it }
        dto.precoRetirada?.let { especificacaoExistente.precoRetirada = it }
        dto.tempoColocacao?.let { especificacaoExistente.tempoColocacao = it }
        dto.tempoManutencao?.let { especificacaoExistente.tempoManutencao = it }
        dto.tempoRetirada?.let { especificacaoExistente.tempoRetirada = it }
        dto.procedimento.let {
            especificacaoExistente.procedimento = it?.let { it1 ->
                procedimentoRepository.findById(it1).orElseThrow {
                    IllegalArgumentException("Procedimento não encontrado com o ID: $it")
                }
            }
        }

        return repository.save(especificacaoExistente)
    }

    fun deletarEspecificacao(id: Int) {
        repository.deleteById(id)
    }

    fun getReceitaAcumulada(): List<Double> {
        return repository.findReceitaSemestralAcumulada()
    }

    fun getReceitaAcumuladaLabels(): List<String> {
        return repository.findMesesUltimosSeisMeses()
    }

    fun getEspecificacoes(): List<String> {
        return repository.findEspecificacoes()
    }
}

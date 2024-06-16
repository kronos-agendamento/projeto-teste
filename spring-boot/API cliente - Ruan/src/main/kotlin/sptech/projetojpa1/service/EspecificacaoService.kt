package sptech.projetojpa1.service

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import sptech.projetojpa1.dominio.Especificacao
import sptech.projetojpa1.dto.especificacao.EspecificacaoDTO
import sptech.projetojpa1.repository.EspecificacaoRepository
import sptech.projetojpa1.repository.ProcedimentoRepository
import sptech.projetojpa1.repository.TempoProcedimentoRepository

@Service
class EspecificacaoService(
    @Autowired private val repository: EspecificacaoRepository,
    @Autowired private val tempoProcedimentoRepository: TempoProcedimentoRepository,
    @Autowired private val procedimentoRepository: ProcedimentoRepository
) {

    fun listarTodos(): List<Especificacao> = repository.findAll()

    fun listarPorEspecificacao(especificacao: String): Especificacao? =
        repository.findByEspecificacaoContainsIgnoreCase(especificacao)

    fun listarPorId(id: Int): Especificacao? = repository.findById(id).orElse(null)

    fun cadastrar(dto: EspecificacaoDTO): Especificacao {
        val tempoProcedimento = tempoProcedimentoRepository.findById(dto.fkTempoProcedimentoId!!)
            .orElseThrow { IllegalArgumentException("TempoProcedimento não encontrado com o ID: ${dto.fkTempoProcedimentoId}") }
        val procedimento = procedimentoRepository.findById(dto.fkProcedimentoId!!)
            .orElseThrow { IllegalArgumentException("Procedimento não encontrado com o ID: ${dto.fkProcedimentoId}") }

        val especificacao = Especificacao(
            especificacao = dto.especificacao,
            precoColocacao = dto.precoColocacao,
            precoManutencao = dto.precoManutencao,
            precoRetirada = dto.precoRetirada,
            foto = null,
            fkTempoProcedimento = tempoProcedimento,
            fkProcedimento = procedimento
        )

        return repository.save(especificacao)
    }

    fun deletarPorId(id: Int) {
        repository.deleteById(id)
    }

fun editarPorId(id: Int, dto: EspecificacaoDTO): Especificacao? {
    val especificacaoExistente = repository.findById(id).orElse(null) ?: return null

    dto.especificacao?.let { especificacaoExistente.especificacao = it }
    dto.precoColocacao?.let { especificacaoExistente.precoColocacao = it }
    dto.precoManutencao?.let { especificacaoExistente.precoManutencao = it }
    dto.precoRetirada?.let { especificacaoExistente.precoRetirada = it }
    dto.fkTempoProcedimentoId?.let {
        especificacaoExistente.fkTempoProcedimento = tempoProcedimentoRepository.findById(it).orElseThrow {
            IllegalArgumentException("TempoProcedimento não encontrado com o ID: $it")
        }
    }
    dto.fkProcedimentoId?.let {
        especificacaoExistente.fkProcedimento = procedimentoRepository.findById(it).orElseThrow {
            IllegalArgumentException("Procedimento não encontrado com o ID: $it")
        }
    }

    return repository.save(especificacaoExistente)
}

    fun atualizarFotoEspecificacao(codigo: Int, imagem: ByteArray): Especificacao? {
        val usuario = repository.findById(codigo).orElse(null) ?: return null
        usuario.foto = imagem
        return repository.save(usuario)
    }

    fun getFoto(codigo: Int): ByteArray? = repository.findFotoByCodigo(codigo)


}

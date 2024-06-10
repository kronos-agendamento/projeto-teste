package sptech.projetojpa1.service

import org.springframework.stereotype.Service
import sptech.projetojpa1.dominio.TempoProcedimento
import sptech.projetojpa1.dto.tempo.TempoProcedimentoRequest
import sptech.projetojpa1.repository.TempoProcedimentoRepository

@Service
data class TempoProcedimentoService(
    private val repository: TempoProcedimentoRepository
) {

    fun listarTodos(): List<TempoProcedimento> =
        repository.findAll()

    fun cadastrar(dto: TempoProcedimentoRequest): TempoProcedimento {
        val tempoProcedimento = TempoProcedimento(
            idTempoProcedimento = 0, // Deixe o ID ser gerado automaticamente
            tempoColocacao = dto.tempoColocacao,
            tempoManutencao = dto.tempoManutencao,
            tempoRetirada = dto.tempoRetirada
        )
        return repository.save(tempoProcedimento)
    }

    fun deletar(id: Int) {
        val temposProcedimento = repository.deleteById(id)
    }

    fun editar(id: Int, dto: TempoProcedimentoRequest): TempoProcedimento? {
        return repository.findById(id).map { tempoProcedimento ->
            tempoProcedimento.tempoColocacao = dto.tempoColocacao
            tempoProcedimento.tempoManutencao = dto.tempoManutencao
            tempoProcedimento.tempoRetirada = dto.tempoRetirada
            repository.save(tempoProcedimento)
        }.orElse(null)
    }
}

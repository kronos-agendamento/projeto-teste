package sptech.projetojpa1.service

import org.springframework.stereotype.Service
import sptech.projetojpa1.dominio.Procedimento
import sptech.projetojpa1.dto.procedimento.ProcedimentoDTO
import sptech.projetojpa1.dto.procedimento.ProcedimentoRequestDTO
import sptech.projetojpa1.dto.procedimento.ProcedimentoResponseDTO
import sptech.projetojpa1.repository.ProcedimentoRepository
import java.util.stream.Collectors

@Service
class ProcedimentoService(private val procedimentoRepository: ProcedimentoRepository) {

    fun criarProcedimento(procedimentoRequestDTO: ProcedimentoRequestDTO): ProcedimentoDTO {
        val procedimento = procedimentoRepository.save(
            Procedimento(
                tipo = procedimentoRequestDTO.tipo,
                descricao = procedimentoRequestDTO.descricao,
                promocao = procedimentoRequestDTO.promocao
            )
        )
        return procedimento.toDTO()
    }

    fun buscarProcedimentoPorId(id: Int): ProcedimentoResponseDTO? {
        val procedimento = procedimentoRepository.findById(id).orElse(null) ?: return null
        return procedimento.toResponseDTO()
    }

    fun listarTodosProcedimentos(): List<ProcedimentoResponseDTO> {
        val procedimentos = procedimentoRepository.findAll()
        return procedimentos.stream()
            .map { procedimento -> procedimento.toResponseDTO() }
            .collect(Collectors.toList())
    }

    fun atualizarProcedimento(id: Int, procedimentoRequestDTO: ProcedimentoRequestDTO): ProcedimentoResponseDTO? {
        val procedimento = procedimentoRepository.findById(id).orElse(null) ?: return null
        procedimento.tipo = procedimentoRequestDTO.tipo
        procedimento.descricao = procedimentoRequestDTO.descricao
        procedimento.promocao = procedimentoRequestDTO.promocao // Atualiza a propriedade promocao
        val updatedProcedimento = procedimentoRepository.save(procedimento)
        return updatedProcedimento.toResponseDTO()
    }

    fun deletarProcedimento(id: Int): Boolean {
        if (procedimentoRepository.existsById(id)) {
            procedimentoRepository.deleteById(id)
            return true
        }
        return false
    }

    private fun Procedimento.toDTO() = ProcedimentoDTO(
        idProcedimento = this.idProcedimento,
        tipo = this.tipo,
        descricao = this.descricao,
        promocao = this.promocao
    )

    private fun Procedimento.toResponseDTO() = ProcedimentoResponseDTO(
        idProcedimento = this.idProcedimento,
        tipo = this.tipo,
        descricao = this.descricao,
        promocao = this.promocao
    )
}

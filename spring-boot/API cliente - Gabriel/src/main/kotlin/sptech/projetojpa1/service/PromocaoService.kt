package sptech.projetojpa1.service

import org.springframework.stereotype.Service
import sptech.projetojpa1.dominio.Promocao
import sptech.projetojpa1.dto.promocao.PromocaoRequestDTO
import sptech.projetojpa1.dto.promocao.PromocaoResponseDTO
import sptech.projetojpa1.repository.PromocaoRepository

@Service
class PromocaoService(private val promocaoRepository: PromocaoRepository) {

    fun getAllPromocoes(): List<PromocaoResponseDTO> =
        promocaoRepository.findAll().map { it.toResponseDTO() }

    fun getPromocaoById(id: Int): PromocaoResponseDTO =
        promocaoRepository.findById(id).orElseThrow { RuntimeException("Promoção não encontrada") }.toResponseDTO()

    fun createPromocao(requestDTO: PromocaoRequestDTO): PromocaoResponseDTO {
        val promocao = promocaoRepository.save(requestDTO.toEntity())
        return promocao.toResponseDTO()
    }

    fun updatePromocao(id: Int, requestDTO: PromocaoRequestDTO): PromocaoResponseDTO {
        val promocao = promocaoRepository.findById(id).orElseThrow { RuntimeException("Promoção não encontrada") }
        val updatedPromocao = promocao.copy(
            tipoPromocao = requestDTO.tipoPromocao,
            descricao = requestDTO.descricao,
            dataInicio = requestDTO.dataInicio,
            dataFim = requestDTO.dataFim
        )
        promocaoRepository.save(updatedPromocao)
        return updatedPromocao.toResponseDTO()
    }

    fun deletePromocao(id: Int) {
        promocaoRepository.deleteById(id)
    }

    private fun Promocao.toResponseDTO() = PromocaoResponseDTO(
        id = this.id,
        tipoPromocao = this.tipoPromocao,
        descricao = this.descricao,
        dataInicio = this.dataInicio,
        dataFim = this.dataFim
    )

    private fun PromocaoRequestDTO.toEntity() = Promocao(
        tipoPromocao = this.tipoPromocao,
        descricao = this.descricao,
        dataInicio = this.dataInicio,
        dataFim = this.dataFim
    )
}

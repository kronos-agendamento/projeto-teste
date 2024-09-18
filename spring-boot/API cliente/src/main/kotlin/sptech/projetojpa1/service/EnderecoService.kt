package sptech.projetojpa1.service

import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import sptech.projetojpa1.dto.endereco.EnderecoRequestDTO
import sptech.projetojpa1.dto.endereco.EnderecoResponseDTO
import sptech.projetojpa1.domain.Endereco
import sptech.projetojpa1.repository.EnderecoRepository

@Service
class EnderecoService(
    private val enderecoRepository: EnderecoRepository
) {

    fun listarEnderecos(): List<EnderecoResponseDTO> {
        return enderecoRepository.findAll().map { it.toResponseDTO() }
    }

    fun buscarEnderecosPorCep(cep: String): List<EnderecoResponseDTO> {
        return enderecoRepository.findByCepContaining(cep).map { it.toResponseDTO() }
    }

    @Transactional
    fun criarEndereco(enderecoDTO: EnderecoRequestDTO): EnderecoResponseDTO {
        val endereco = enderecoDTO.toEntity()
        return enderecoRepository.save(endereco).toResponseDTO()
    }

    @Transactional
    fun atualizarEndereco(id: Int, enderecoDTO: EnderecoRequestDTO): EnderecoResponseDTO? {
        return enderecoRepository.findById(id).map { endereco ->
            endereco.apply {
                logradouro = enderecoDTO.logradouro
                numero = enderecoDTO.numero
                cep = enderecoDTO.cep
                bairro = enderecoDTO.bairro
                cidade = enderecoDTO.cidade
                estado = enderecoDTO.estado
                complemento = enderecoDTO.complemento
            }
            enderecoRepository.save(endereco).toResponseDTO()
        }.orElse(null)
    }

    fun buscarApenasUltimoEndereco(): Int? {
        return enderecoRepository.findTopByOrderByIdEnderecoDesc()?.idEndereco
    }

    @Transactional
    fun deletarEndereco(id: Int): Boolean {
        return if (enderecoRepository.existsById(id)) {
            enderecoRepository.deleteById(id)
            true
        } else {
            false
        }
    }

    private fun Endereco.toResponseDTO() = EnderecoResponseDTO(
        idEndereco = this.idEndereco!!,
        logradouro = this.logradouro,
        numero = this.numero,
        cep = this.cep,
        bairro = this.bairro,
        cidade = this.cidade,
        estado = this.estado
    )

    private fun EnderecoRequestDTO.toEntity() = Endereco(
        logradouro = this.logradouro,
        numero = this.numero,
        cep = this.cep,
        bairro = this.bairro,
        cidade = this.cidade,
        estado = this.estado,
        complemento = this.complemento
    )
}
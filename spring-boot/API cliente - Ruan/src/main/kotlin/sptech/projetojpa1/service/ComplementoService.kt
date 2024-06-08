package sptech.projetojpa1.service

import org.springframework.stereotype.Service
import sptech.projetojpa1.dto.complemento.ComplementoRequestDTO
import sptech.projetojpa1.dto.complemento.ComplementoResponseDTO
import sptech.projetojpa1.dto.complemento.ComplementoUpdateDTO
import sptech.projetojpa1.dominio.Complemento
import sptech.projetojpa1.repository.ComplementoRepository
import sptech.projetojpa1.repository.EnderecoRepository

@Service
class ComplementoService(
    private val complementoRepository: ComplementoRepository,
    private val enderecoRepository: EnderecoRepository
) {

    fun cadastrarComplemento(dto: ComplementoRequestDTO): ComplementoResponseDTO {
        val endereco = enderecoRepository.findById(dto.enderecoId)
            .orElseThrow { IllegalArgumentException("Endereço não encontrado") }
        if (dto.complemento.isBlank()) {
            throw IllegalArgumentException("Complemento não pode ser nulo ou vazio")
        }
        val complemento = Complemento(codigo = null, complemento = dto.complemento, endereco = endereco)
        complementoRepository.save(complemento)
        return ComplementoResponseDTO(complemento.codigo!!, complemento.complemento!!, endereco.codigo!!)
    }

    fun obterComplementoPorId(id: Int): ComplementoResponseDTO {
        val complemento =
            complementoRepository.findById(id).orElseThrow { IllegalArgumentException("Complemento não encontrado") }
        return ComplementoResponseDTO(complemento.codigo!!, complemento.complemento!!, complemento.endereco!!.codigo!!)
    }

    fun obterComplementosPorIdEndereco(enderecoId: Int): List<ComplementoResponseDTO> {
        val complementos = complementoRepository.findByEnderecoId(enderecoId)
        return complementos.map { ComplementoResponseDTO(it.codigo!!, it.complemento!!, it.endereco!!.codigo!!) }
    }

    fun editarComplemento(id: Int, dto: ComplementoUpdateDTO): ComplementoResponseDTO {
        val complemento =
            complementoRepository.findById(id).orElseThrow { IllegalArgumentException("Complemento não encontrado") }
        if (dto.complemento.isBlank()) {
            throw IllegalArgumentException("Complemento não pode ser nulo ou vazio")
        }
        complemento.complemento = dto.complemento
        complementoRepository.save(complemento)
        return ComplementoResponseDTO(complemento.codigo!!, complemento.complemento!!, complemento.endereco!!.codigo!!)
    }

    fun excluirComplemento(id: Int) {
        if (!complementoRepository.existsById(id)) {
            throw IllegalArgumentException("Complemento não encontrado")
        }
        complementoRepository.deleteById(id)
    }
}
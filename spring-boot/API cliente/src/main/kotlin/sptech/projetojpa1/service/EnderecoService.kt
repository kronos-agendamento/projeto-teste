package sptech.projetojpa1.service

import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import sptech.projetojpa1.dto.endereco.EnderecoRequestDTO
import sptech.projetojpa1.dto.endereco.EnderecoResponseDTO
import sptech.projetojpa1.dominio.Endereco
import sptech.projetojpa1.repository.ComplementoRepository
import sptech.projetojpa1.repository.EnderecoRepository
import sptech.projetojpa1.repository.UsuarioRepository

@Service
class EnderecoService(
    private val enderecoRepository: EnderecoRepository,
    private val complementoRepository: ComplementoRepository,
    private val usuarioRepository: UsuarioRepository
) {

    @Transactional
    fun cadastrarEndereco(novoEnderecoDTO: EnderecoRequestDTO): EnderecoResponseDTO {
        val endereco = Endereco(
            codigo = null,
            logradouro = novoEnderecoDTO.logradouro,
            cep = novoEnderecoDTO.cep,
            bairro = novoEnderecoDTO.bairro,
            cidade = novoEnderecoDTO.cidade,
            estado = novoEnderecoDTO.estado,
            numero = novoEnderecoDTO.numero,
            complemento = novoEnderecoDTO.complemento,
        )
        val enderecoSalvo = enderecoRepository.save(endereco)
        return toResponseDTO(enderecoSalvo)
    }

    fun listarTodosEnderecos(): List<EnderecoResponseDTO> {
        return enderecoRepository.findAll().map { toResponseDTO(it) }
    }

    fun buscarEnderecoPorCodigo(codigo: Int): EnderecoResponseDTO? {
        return enderecoRepository.findById(codigo).map { toResponseDTO(it) }.orElse(null)
    }

    fun listarEnderecosPorCEP(cep: String): List<EnderecoResponseDTO> {
        return enderecoRepository.findByCepContains(cep).map { toResponseDTO(it) }
    }

    fun listarEnderecosPorBairro(bairro: String): List<EnderecoResponseDTO> {
        return enderecoRepository.findByBairroContainsIgnoreCase(bairro).map { toResponseDTO(it) }
    }

    @Transactional
    fun excluirEndereco(id: Int): Boolean {
        return if (enderecoRepository.existsById(id)) {
            enderecoRepository.deleteById(id)
            true
        } else {
            false
        }
    }

    private fun toResponseDTO(endereco: Endereco): EnderecoResponseDTO {
        return EnderecoResponseDTO(
            codigo = endereco.codigo!!,
            logradouro = endereco.logradouro,
            cep = endereco.cep,
            bairro = endereco.bairro,
            cidade = endereco.cidade,
            estado = endereco.estado
        )
    }

    @Transactional
    fun atualizarEndereco(id: Int, enderecoDTO: EnderecoRequestDTO): EnderecoResponseDTO? {
        val enderecoOptional = enderecoRepository.findById(id)

        return if (enderecoOptional.isPresent) {
            val endereco = enderecoOptional.get()
            endereco.logradouro = enderecoDTO.logradouro
            endereco.cep = enderecoDTO.cep
            endereco.bairro = enderecoDTO.bairro
            endereco.cidade = enderecoDTO.cidade
            endereco.estado = enderecoDTO.estado

            val enderecoAtualizado = enderecoRepository.save(endereco)
            toResponseDTO(enderecoAtualizado)
        } else {
            null
        }
    }

}

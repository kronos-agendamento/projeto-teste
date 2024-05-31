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
//        val complemento = novoEnderecoDTO.complementoId?.let { complementoRepository.findById(it).orElse(null) }
//        val usuario = novoEnderecoDTO.usuarioId?.let { usuarioRepository.findById(it).orElse(null) }
        val endereco = Endereco(
            codigo = null,
            logradouro = novoEnderecoDTO.logradouro,
            cep = novoEnderecoDTO.cep,
            numero = novoEnderecoDTO.numero,
            bairro = novoEnderecoDTO.bairro,
            cidade = novoEnderecoDTO.cidade,
            estado = novoEnderecoDTO.estado
//            complemento = complemento,
//            usuario = usuario
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

//    fun listarEnderecosPorUsuario(usuario: String): List<EnderecoResponseDTO> {
//        return enderecoRepository.findByUsuarioNomeContains(usuario).map { toResponseDTO(it) }
//    }

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
            numero = endereco.numero,
            bairro = endereco.bairro,
            cidade = endereco.cidade,
            estado = endereco.estado
//            complementoId = endereco.complemento?.codigo,
//            usuarioId = endereco.usuario?.codigo
        )
    }
}

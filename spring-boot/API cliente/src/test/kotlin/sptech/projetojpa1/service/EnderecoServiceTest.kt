package sptech.projetojpa1.service

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.Mockito
import org.mockito.junit.jupiter.MockitoExtension
import sptech.projetojpa1.dominio.Endereco
import sptech.projetojpa1.dto.endereco.EnderecoRequestDTO
import sptech.projetojpa1.dto.endereco.EnderecoResponseDTO
import sptech.projetojpa1.repository.ComplementoRepository
import sptech.projetojpa1.repository.EnderecoRepository
import sptech.projetojpa1.repository.UsuarioRepository
import java.util.*

@ExtendWith(MockitoExtension::class)
class EnderecoServiceTest {

    @Mock
    private lateinit var enderecoRepository: EnderecoRepository

    @Mock
    private lateinit var complementoRepository: ComplementoRepository

    @Mock
    private lateinit var usuarioRepository: UsuarioRepository

    @InjectMocks
    private lateinit var enderecoService: EnderecoService

    @Test
    @DisplayName("Teste de cadastro de endereço com dados válidos")
    fun `cadastrarEndereco should create and return EnderecoResponseDTO`() {
        val novoEnderecoDTO = EnderecoRequestDTO(
            logradouro = "Rua A",
            cep = "12345678",
            numero = 100,
            bairro = "Bairro B",
            cidade = "Cidade C",
            estado = "Estado D"
        )
        val endereco = Endereco(
            codigo = 1,
            logradouro = novoEnderecoDTO.logradouro,
            cep = novoEnderecoDTO.cep,
            numero = novoEnderecoDTO.numero,
            bairro = novoEnderecoDTO.bairro,
            cidade = novoEnderecoDTO.cidade,
            estado = novoEnderecoDTO.estado
        )

        Mockito.`when`(enderecoRepository.save(Mockito.any(Endereco::class.java))).thenReturn(endereco)

        val result = enderecoService.cadastrarEndereco(novoEnderecoDTO)

        assertNotNull(result)
        assertEquals(novoEnderecoDTO.logradouro, result.logradouro)
        assertEquals(novoEnderecoDTO.cep, result.cep)
        assertEquals(novoEnderecoDTO.numero, result.numero)
        assertEquals(novoEnderecoDTO.bairro, result.bairro)
        assertEquals(novoEnderecoDTO.cidade, result.cidade)
        assertEquals(novoEnderecoDTO.estado, result.estado)
    }

    @Test
    @DisplayName("Teste de listagem de todos os endereços")
    fun `listarTodosEnderecos should return a list of EnderecoResponseDTO`() {
        val endereco = Endereco(
            codigo = 1,
            logradouro = "Rua A",
            cep = "12345678",
            numero = 100,
            bairro = "Bairro B",
            cidade = "Cidade C",
            estado = "Estado D"
        )

        Mockito.`when`(enderecoRepository.findAll()).thenReturn(listOf(endereco))

        val result = enderecoService.listarTodosEnderecos()

        assertNotNull(result)
        assertEquals(1, result.size)
        assertEquals(endereco.logradouro, result[0].logradouro)
    }

    @Test
    @DisplayName("Teste de busca de endereço por código")
    fun `buscarEnderecoPorCodigo should return EnderecoResponseDTO`() {
        val endereco = Endereco(
            codigo = 1,
            logradouro = "Rua A",
            cep = "12345678",
            numero = 100,
            bairro = "Bairro B",
            cidade = "Cidade C",
            estado = "Estado D"
        )

        Mockito.`when`(enderecoRepository.findById(1)).thenReturn(Optional.of(endereco))

        val result = enderecoService.buscarEnderecoPorCodigo(1)

        assertNotNull(result)
        assertEquals(endereco.logradouro, result?.logradouro)
    }

    @Test
    @DisplayName("Teste de listagem de endereços por CEP")
    fun `listarEnderecosPorCEP should return a list of EnderecoResponseDTO`() {
        val endereco = Endereco(
            codigo = 1,
            logradouro = "Rua A",
            cep = "12345678",
            numero = 100,
            bairro = "Bairro B",
            cidade = "Cidade C",
            estado = "Estado D"
        )

        Mockito.`when`(enderecoRepository.findByCepContains("123")).thenReturn(listOf(endereco))

        val result = enderecoService.listarEnderecosPorCEP("123")

        assertNotNull(result)
        assertEquals(1, result.size)
        assertEquals(endereco.logradouro, result[0].logradouro)
    }

    @Test
    @DisplayName("Teste de listagem de endereços por bairro")
    fun `listarEnderecosPorBairro should return a list of EnderecoResponseDTO`() {
        val endereco = Endereco(
            codigo = 1,
            logradouro = "Rua A",
            cep = "12345678",
            numero = 100,
            bairro = "Bairro B",
            cidade = "Cidade C",
            estado = "Estado D"
        )

        Mockito.`when`(enderecoRepository.findByBairroContainsIgnoreCase("bairro b")).thenReturn(listOf(endereco))

        val result = enderecoService.listarEnderecosPorBairro("bairro b")

        assertNotNull(result)
        assertEquals(1, result.size)
        assertEquals(endereco.logradouro, result[0].logradouro)
    }

    @Test
    @DisplayName("Teste de exclusão de endereço existente")
    fun `excluirEndereco should return true when endereco exists`() {
        Mockito.`when`(enderecoRepository.existsById(1)).thenReturn(true)

        val result = enderecoService.excluirEndereco(1)

        assertTrue(result)
        Mockito.verify(enderecoRepository).deleteById(1)
    }

    @Test
    @DisplayName("Teste de tentativa de exclusão de endereço inexistente")
    fun `excluirEndereco should return false when endereco does not exist`() {
        Mockito.`when`(enderecoRepository.existsById(1)).thenReturn(false)

        val result = enderecoService.excluirEndereco(1)

        assertFalse(result)
        Mockito.verify(enderecoRepository, Mockito.never()).deleteById(1)
    }
}

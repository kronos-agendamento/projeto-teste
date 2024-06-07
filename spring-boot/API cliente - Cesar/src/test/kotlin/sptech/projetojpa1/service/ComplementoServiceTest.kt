package sptech.projetojpa1.service

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.Mockito.*
import org.mockito.junit.jupiter.MockitoExtension
import sptech.projetojpa1.dto.complemento.ComplementoRequestDTO
import sptech.projetojpa1.dto.complemento.ComplementoResponseDTO
import sptech.projetojpa1.dto.complemento.ComplementoUpdateDTO
import sptech.projetojpa1.dominio.Complemento
import sptech.projetojpa1.dominio.Endereco
import sptech.projetojpa1.repository.ComplementoRepository
import sptech.projetojpa1.repository.EnderecoRepository
import java.util.*

@ExtendWith(MockitoExtension::class)
class ComplementoServiceTest {

    @Mock
    lateinit var complementoRepository: ComplementoRepository

    @Mock
    lateinit var enderecoRepository: EnderecoRepository

    @InjectMocks
    lateinit var complementoService: ComplementoService

    @Test
    @DisplayName("Teste de cadastro de complemento com dados válidos")
    fun `test cadastrarComplemento`() {
        val endereco = Endereco(1, "Rua ABC", "12345678", 123, "Bairro XYZ", "Cidade ABC", "Estado XYZ")
        val dto = ComplementoRequestDTO("Apto 101", 1)

        `when`(enderecoRepository.findById(1)).thenReturn(Optional.of(endereco))
        `when`(complementoRepository.save(any(Complemento::class.java))).thenAnswer {
            val complemento = it.arguments[0] as Complemento
            complemento.codigo = 1
            complemento
        }

        val result = complementoService.cadastrarComplemento(dto)

        assertNotNull(result)
        assertEquals(1, result.codigo)
        assertEquals("Apto 101", result.complemento)
        assertEquals(1, result.enderecoId)
    }

    @Test
    @DisplayName("Teste de obtenção de complemento por ID")
    fun `test obterComplementoPorId`() {
        val endereco = Endereco(1, "Rua ABC", "12345678", 123, "Bairro XYZ", "Cidade ABC", "Estado XYZ")
        val complemento = Complemento(1, "Apto 101", endereco)

        `when`(complementoRepository.findById(1)).thenReturn(Optional.of(complemento))

        val result = complementoService.obterComplementoPorId(1)

        assertNotNull(result)
        assertEquals(1, result.codigo)
        assertEquals("Apto 101", result.complemento)
        assertEquals(1, result.enderecoId)
    }

    @Test
    @DisplayName("Teste de obtenção de complementos por ID de endereço")
    fun `test obterComplementosPorIdEndereco`() {
        val endereco = Endereco(1, "Rua ABC", "12345678", 123, "Bairro XYZ", "Cidade ABC", "Estado XYZ")
        val complemento1 = Complemento(1, "Apto 101", endereco)
        val complemento2 = Complemento(2, "Apto 102", endereco)
        val complementos = listOf(complemento1, complemento2)

        `when`(complementoRepository.findByEnderecoId(1)).thenReturn(complementos)

        val result = complementoService.obterComplementosPorIdEndereco(1)

        assertNotNull(result)
        assertEquals(2, result.size)
    }

    @Test
    @DisplayName("Teste de edição de complemento com dados válidos")
    fun `test editarComplemento`() {
        val endereco = Endereco(1, "Rua ABC", "12345678", 123, "Bairro XYZ", "Cidade ABC", "Estado XYZ")
        val complemento = Complemento(1, "Apto 101", endereco)
        val updateDto = ComplementoUpdateDTO("Apto 202")

        `when`(complementoRepository.findById(1)).thenReturn(Optional.of(complemento))
        `when`(complementoRepository.save(any(Complemento::class.java))).thenAnswer { it.arguments[0] as Complemento }

        val result = complementoService.editarComplemento(1, updateDto)

        assertNotNull(result)
        assertEquals(1, result.codigo)
        assertEquals("Apto 202", result.complemento)
        assertEquals(1, result.enderecoId)
    }

    @Test
    @DisplayName("Teste de exclusão de complemento existente")
    fun `test excluirComplemento`() {
        `when`(complementoRepository.existsById(1)).thenReturn(true)

        complementoService.excluirComplemento(1)

        verify(complementoRepository, times(1)).deleteById(1)
    }
}

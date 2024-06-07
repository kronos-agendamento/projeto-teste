package sptech.projetojpa1.service

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.Mockito
import org.mockito.junit.jupiter.MockitoExtension
import sptech.projetojpa1.dominio.Empresa
import sptech.projetojpa1.dominio.Endereco
import sptech.projetojpa1.dto.empresa.EmpresaRequestDTO
import sptech.projetojpa1.dto.empresa.EmpresaResponseDTO
import sptech.projetojpa1.dto.empresa.EmpresaUpdateDTO
import sptech.projetojpa1.repository.EmpresaRepository
import sptech.projetojpa1.repository.EnderecoRepository
import sptech.projetojpa1.repository.HorarioFuncionamentoRepository
import java.util.*

@ExtendWith(MockitoExtension::class)
class EmpresaServiceTest {

    @Mock
    private lateinit var empresaRepository: EmpresaRepository

    @Mock
    private lateinit var enderecoRepository: EnderecoRepository

    @Mock
    private lateinit var horarioFuncionamentoRepository: HorarioFuncionamentoRepository

    @InjectMocks
    private lateinit var empresaService: EmpresaService

    @Test
    @DisplayName("Teste de cadastro de empresa com dados válidos")
    fun `cadastrarEmpresa should create and return EmpresaResponseDTO`() {
        val endereco = Endereco(1, "Rua A", "12345678", 100, "Bairro B", "Cidade C", "Estado D")
        val empresa = Empresa(1, "Empresa A", 'A', "00.000.000/0001-00", endereco, null)
        val dto = EmpresaRequestDTO("Empresa A", 'A', "00.000.000/0001-00", 1, null)

        Mockito.`when`(enderecoRepository.findById(dto.enderecoId)).thenReturn(Optional.of(endereco))
        Mockito.`when`(empresaRepository.save(Mockito.any(Empresa::class.java))).thenReturn(empresa)

        val result = empresaService.cadastrarEmpresa(dto)

        assertNotNull(result)
        assertEquals(dto.nome, result.nome)
        assertEquals(dto.CNPJ, result.CNPJ)
        assertEquals(dto.enderecoId, result.enderecoId)
    }

    @Test
    @DisplayName("Teste de exclusão de empresa por CNPJ")
    fun `excluirEmpresaPorCNPJ should delete empresa and return success message`() {
        val cnpj = "00.000.000/0001-00"

        val result = empresaService.excluirEmpresaPorCNPJ(cnpj)

        Mockito.verify(empresaRepository).deleteByCNPJ(cnpj)
        assertEquals("Empresa com CNPJ $cnpj excluída com sucesso", result)
    }

    @Test
    @DisplayName("Teste de listagem de todas as empresas")
    fun `listarEmpresas should return a list of EmpresaResponseDTO`() {
        val endereco = Endereco(1, "Rua A", "12345678", 100, "Bairro B", "Cidade C", "Estado D")
        val empresa = Empresa(1, "Empresa A", 'A', "00.000.000/0001-00", endereco, null)

        Mockito.`when`(empresaRepository.findAll()).thenReturn(listOf(empresa))

        val result = empresaService.listarEmpresas()

        assertNotNull(result)
        assertEquals(1, result.size)
        assertEquals(empresa.nome, result[0].nome)
    }

    @Test
    @DisplayName("Teste de filtragem de empresas por nome")
    fun `filtrarPorNome should return a list of EmpresaResponseDTO`() {
        val endereco = Endereco(1, "Rua A", "12345678", 100, "Bairro B", "Cidade C", "Estado D")
        val empresa = Empresa(1, "Empresa A", 'A', "00.000.000/0001-00", endereco, null)
        val nome = "Empresa A"

        Mockito.`when`(empresaRepository.findByNomeContainsIgnoreCase(nome)).thenReturn(listOf(empresa))

        val result = empresaService.filtrarPorNome(nome)

        assertNotNull(result)
        assertEquals(1, result.size)
        assertEquals(empresa.nome, result[0].nome)
    }

    @Test
    @DisplayName("Teste de atualização de empresa")
    fun `atualizarEmpresa should update and return EmpresaResponseDTO`() {
        val endereco = Endereco(1, "Rua A", "12345678", 100, "Bairro B", "Cidade C", "Estado D")
        val empresa = Empresa(1, "Empresa A", 'A', "00.000.000/0001-00", endereco, null)
        val dto = EmpresaUpdateDTO("Empresa B", 'B', "11.111.111/1111-11", 1, null)

        Mockito.`when`(empresaRepository.buscarPeloNomeIgnoreCase("Empresa A")).thenReturn(empresa)
        Mockito.`when`(enderecoRepository.findById(1)).thenReturn(Optional.of(endereco))
        Mockito.`when`(empresaRepository.save(Mockito.any(Empresa::class.java))).thenReturn(empresa)

        val result = empresaService.atualizarEmpresa("Empresa A", dto)

        assertNotNull(result)
        assertEquals(dto.nome, result?.nome)
    }

    @Test
    @DisplayName("Teste de edição de endereço de uma empresa")
    fun `editarEndereco should update endereco and return EmpresaResponseDTO`() {
        val endereco = Endereco(1, "Rua A", "12345678", 100, "Bairro B", "Cidade C", "Estado D")
        val empresa = Empresa(1, "Empresa A", 'A', "00.000.000/0001-00", endereco, null)
        val dto = EmpresaUpdateDTO(null, null, null, 2, null)

        Mockito.`when`(empresaRepository.buscarPeloCNPJ("00.000.000/0001-00")).thenReturn(empresa)
        Mockito.`when`(enderecoRepository.findById(2)).thenReturn(Optional.of(endereco))
        Mockito.`when`(empresaRepository.save(Mockito.any(Empresa::class.java))).thenReturn(empresa)

        val result = empresaService.editarEndereco("00.000.000/0001-00", dto)

        assertNotNull(result)
        assertEquals(endereco.codigo, result?.enderecoId)
    }
}

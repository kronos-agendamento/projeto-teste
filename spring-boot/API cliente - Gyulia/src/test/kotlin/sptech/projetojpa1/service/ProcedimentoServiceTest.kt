package sptech.projetojpa1.service

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.Mockito.`when`
import org.mockito.Mockito.any
import org.mockito.Mockito.anyInt
import org.mockito.Mockito.mock
import org.mockito.MockitoAnnotations
import sptech.projetojpa1.dominio.Procedimento
import sptech.projetojpa1.dto.procedimento.ProcedimentoRequestDTO
import sptech.projetojpa1.repository.ProcedimentoRepository
import java.util.Optional

class ProcedimentoServiceTest {

    @Mock
    private lateinit var procedimentoRepository: ProcedimentoRepository

    @InjectMocks
    private lateinit var procedimentoService: ProcedimentoService

    @BeforeEach
    fun setUp() {
        MockitoAnnotations.openMocks(this)
    }

    @Test
    fun `Teste criarProcedimento - Deve criar um novo procedimento`() {
        // Configuração do mock do repositório
        val procedimentoRequestDTO = ProcedimentoRequestDTO("Tipo", "Descrição")
        val procedimento = Procedimento(1, "Tipo", "Descrição")
        `when`(procedimentoRepository.save(any(Procedimento::class.java))).thenReturn(procedimento)

        // Execução do método a ser testado
        val result = procedimentoService.criarProcedimento(procedimentoRequestDTO)

        // Verificação do resultado
        assertEquals(1, result.idProcedimento)
        assertEquals("Tipo", result.tipo)
        assertEquals("Descrição", result.descricao)
    }

    @Test
    fun `Teste buscarProcedimentoPorId - Deve retornar um procedimento existente`() {
        // Configuração do mock do repositório
        val procedimento = Procedimento(1, "Tipo", "Descrição")
        `when`(procedimentoRepository.findById(anyInt())).thenReturn(Optional.of(procedimento))

        // Execução do método a ser testado
        val result = procedimentoService.buscarProcedimentoPorId(1)

        // Verificação do resultado
        assertEquals(1, result?.idProcedimento)
        assertEquals("Tipo", result?.tipo)
        assertEquals("Descrição", result?.descricao)
    }

    @Test
    fun `Teste buscarProcedimentoPorId - Deve retornar nulo para um procedimento inexistente`() {
        // Configuração do mock do repositório
        `when`(procedimentoRepository.findById(anyInt())).thenReturn(Optional.empty())

        // Execução do método a ser testado
        val result = procedimentoService.buscarProcedimentoPorId(1)

        // Verificação do resultado
        assertEquals(null, result)
    }

    @Test
    fun `Teste listarTodosProcedimentos - Deve retornar uma lista de procedimentos`() {
        // Configuração do mock do repositório
        val procedimentos = listOf(
            Procedimento(1, "Tipo1", "Descrição1"),
            Procedimento(2, "Tipo2", "Descrição2")
        )
        `when`(procedimentoRepository.findAll()).thenReturn(procedimentos)

        // Execução do método a ser testado
        val result = procedimentoService.listarTodosProcedimentos()

        // Verificação do resultado
        assertEquals(2, result.size)
        assertEquals(1, result[0].idProcedimento)
        assertEquals("Tipo1", result[0].tipo)
        assertEquals("Descrição1", result[0].descricao)
        assertEquals(2, result[1].idProcedimento)
        assertEquals("Tipo2", result[1].tipo)
        assertEquals("Descrição2", result[1].descricao)
    }

    @Test
    fun `Teste atualizarProcedimento - Deve atualizar um procedimento existente`() {
        // Configuração do mock do repositório
        val procedimentoRequestDTO = ProcedimentoRequestDTO("Novo Tipo", "Nova Descrição")
        val procedimento = Procedimento(1, "Tipo", "Descrição")
        val procedimentoAtualizado = Procedimento(1, "Novo Tipo", "Nova Descrição")
        `when`(procedimentoRepository.findById(anyInt())).thenReturn(Optional.of(procedimento))
        `when`(procedimentoRepository.save(any(Procedimento::class.java))).thenReturn(procedimentoAtualizado)

        // Execução do método a ser testado
        val result = procedimentoService.atualizarProcedimento(1, procedimentoRequestDTO)

        // Verificação do resultado
        assertEquals(1, result?.idProcedimento)
        assertEquals("Novo Tipo", result?.tipo)
        assertEquals("Nova Descrição", result?.descricao)
    }

    @Test
    fun `Teste atualizarProcedimento - Deve retornar nulo ao tentar atualizar um procedimento inexistente`() {
        // Configuração do mock do repositório
        val procedimentoRequestDTO = ProcedimentoRequestDTO("Novo Tipo", "Nova Descrição")
        `when`(procedimentoRepository.findById(anyInt())).thenReturn(Optional.empty())

        // Execução do método a ser testado
        val result = procedimentoService.atualizarProcedimento(1, procedimentoRequestDTO)

        // Verificação do resultado
        assertEquals(null, result)
    }

    @Test
    fun `Teste deletarProcedimento - Deve deletar um procedimento existente`() {
        // Configuração do mock do repositório
        `when`(procedimentoRepository.existsById(anyInt())).thenReturn(true)

        // Execução do método a ser testado
        val result = procedimentoService.deletarProcedimento(1)

        // Verificação do resultado
        assertTrue(result)
    }

    @Test
    fun `Teste deletarProcedimento - Deve retornar falso ao tentar deletar um procedimento inexistente`() {
        // Configuração do mock do repositório
        `when`(procedimentoRepository.existsById(anyInt())).thenReturn(false)

        // Execução do método a ser testado
        val result = procedimentoService.deletarProcedimento(1)

        // Verificação do resultado
        assertTrue(!result)
    }
}

package sptech.projetojpa1.service

import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import sptech.projetojpa1.dominio.TempoProcedimento
import sptech.projetojpa1.dto.tempo.TempoProcedimentoRequest
import sptech.projetojpa1.repository.TempoProcedimentoRepository
import java.util.*

class TempoProcedimentoServiceTest {

    private lateinit var repository: TempoProcedimentoRepository
    private lateinit var service: TempoProcedimentoService

    @BeforeEach
    fun setUp() {
        repository = mockk()
        service = TempoProcedimentoService(repository)
    }

    @Test
    fun `listarTodos deve retornar lista de tempos de procedimento`() {
        val temposProcedimento = listOf(
            TempoProcedimento(1, "01:00", "02:00", "03:00"),
            TempoProcedimento(2, "04:00", "05:00", "06:00")
        )

        every { repository.findAll() } returns temposProcedimento

        val result = service.listarTodos()

        assertEquals(2, result.size)
        assertEquals("01:00", result[0].tempoColocacao)
        assertEquals("04:00", result[1].tempoColocacao)
        verify { repository.findAll() }
    }

    @Test
    fun `cadastrar deve retornar tempo de procedimento cadastrado`() {
        val tempoRequest = TempoProcedimentoRequest("01:00", "02:00", "03:00")
        val tempoProcedimento = TempoProcedimento(1, "01:00", "02:00", "03:00")

        every { repository.save(any<TempoProcedimento>()) } returns tempoProcedimento

        val result = service.cadastrar(tempoRequest)

        assertNotNull(result)
        assertEquals(1, result.idTempoProcedimento)
        assertEquals("01:00", result.tempoColocacao)
        assertEquals("02:00", result.tempoManutencao)
        assertEquals("03:00", result.tempoRetirada)
        verify { repository.save(any<TempoProcedimento>()) }
    }

    @Test
    fun `deletar deve chamar repository deleteById`() {
        every { repository.deleteById(1) } returns Unit

        service.deletar(1)

        verify { repository.deleteById(1) }
    }

    @Test
    fun `editar deve retornar tempo de procedimento editado quando encontrado`() {
        val tempoRequest = TempoProcedimentoRequest("01:00", "02:00", "03:00")
        val tempoProcedimento = TempoProcedimento(1, "00:00", "00:00", "00:00")

        every { repository.findById(1) } returns Optional.of(tempoProcedimento)
        every { repository.save(any<TempoProcedimento>()) } returns tempoProcedimento

        val result = service.editar(1, tempoRequest)

        assertNotNull(result)
        assertEquals(1, result?.idTempoProcedimento)
        assertEquals("01:00", result?.tempoColocacao)
        assertEquals("02:00", result?.tempoManutencao)
        assertEquals("03:00", result?.tempoRetirada)
        verify { repository.findById(1) }
        verify { repository.save(any<TempoProcedimento>()) }
    }

    @Test
    fun `editar deve retornar null quando tempo de procedimento não encontrado`() {
        val tempoRequest = TempoProcedimentoRequest("01:00", "02:00", "03:00")

        every { repository.findById(1) } returns Optional.empty()

        val result = service.editar(1, tempoRequest)

        assertNull(result)
        verify { repository.findById(1) }
        verify(exactly = 0) { repository.save(any<TempoProcedimento>()) }
    }
}

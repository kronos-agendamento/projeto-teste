package sptech.projetojpa1.service

import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import sptech.projetojpa1.dominio.Status
import sptech.projetojpa1.dto.status.StatusRequest
import sptech.projetojpa1.dto.status.StatusResponse
import sptech.projetojpa1.repository.StatusRepository
import java.util.*

class  StatusServiceTest {

    private lateinit var repository: StatusRepository
    private lateinit var service: StatusService

    @BeforeEach
    fun setUp() {
        repository = mockk()
        service = StatusService(repository)
    }

    @Test
    @DisplayName("Deve salvar e retornar StatusResponse ao criar um novo status")
    fun `createStatus deve salvar e retornar StatusResponse`() {
        val statusRequest = StatusRequest(
            nome = "Ativo",
            cor = "Verde",
            motivo = "Motivo de teste"
        )
        val status = Status(
            id = 1,
            nome = statusRequest.nome,
            cor = statusRequest.cor,
            motivo = statusRequest.motivo
        )

        every { repository.save(any<Status>()) } returns status

        val result = service.createStatus(statusRequest)

        assertNotNull(result)
        assertEquals(1, result.id)
        assertEquals(statusRequest.nome, result.nome)
        assertEquals(statusRequest.cor, result.cor)
        assertEquals(statusRequest.motivo, result.motivo)
        verify { repository.save(any<Status>()) }
    }

    @Test
    @DisplayName("Deve retornar uma lista de StatusResponse ao buscar todos os status")
    fun `getAllStatuses deve retornar uma lista de StatusResponse`() {
        val statuses = listOf(
            Status(1, "Ativo", "Verde", "Motivo 1"),
            Status(2, "Inativo", "Vermelho", "Motivo 2")
        )

        every { repository.findAll() } returns statuses

        val result = service.getAllStatuses()

        assertEquals(2, result.size)
        assertEquals("Ativo", result[0].nome)
        assertEquals("Inativo", result[1].nome)
        verify { repository.findAll() }
    }

    @Test
    @DisplayName("Deve retornar StatusResponse quando encontrado pelo ID")
    fun `getStatusById deve retornar StatusResponse quando encontrado`() {
        val status = Status(1, "Ativo", "Verde", "Motivo 1")

        every { repository.findById(1) } returns Optional.of(status)

        val result = service.getStatusById(1)

        assertNotNull(result)
        assertEquals(1, result?.id)
        assertEquals("Ativo", result?.nome)
        verify { repository.findById(1) }
    }

    @Test
    @DisplayName("Deve retornar null quando status não for encontrado pelo ID")
    fun `getStatusById deve retornar null quando nao encontrado`() {
        every { repository.findById(1) } returns Optional.empty()

        val result = service.getStatusById(1)

        assertNull(result)
        verify { repository.findById(1) }
    }

    @Test
    @DisplayName("Deve retornar true ao deletar um status existente")
    fun `deleteStatus deve retornar true quando encontrado`() {
        every { repository.existsById(1) } returns true
        every { repository.deleteById(1) } returns Unit

        val result = service.deleteStatus(1)

        assertTrue(result)
        verify { repository.existsById(1) }
        verify { repository.deleteById(1) }
    }

    @Test
    @DisplayName("Deve retornar false ao tentar deletar um status inexistente")
    fun `deleteStatus deve retornar false quando nao encontrado`() {
        every { repository.existsById(1) } returns false

        val result = service.deleteStatus(1)

        assertFalse(result)
        verify { repository.existsById(1) }
    }

    @Test
    @DisplayName("Deve atualizar e retornar StatusResponse ao modificar um status existente")
    fun `updateStatus deve atualizar e retornar StatusResponse`() {
        val status = Status(1, "Ativo", "Verde", "Motivo 1")
        val updatedStatus = status.copy(motivo = "Motivo atualizado")

        every { repository.findById(1) } returns Optional.of(status)
        every { repository.save(any<Status>()) } returns updatedStatus

        val result = service.updateStatus(1, "Motivo atualizado")

        assertNotNull(result)
        assertEquals(1, result?.id)
        assertEquals("Motivo atualizado", result?.motivo)
        verify { repository.findById(1) }
        verify { repository.save(any<Status>()) }
    }

    @Test
    @DisplayName("Deve lançar IllegalArgumentException quando motivo for nulo ou vazio ao atualizar status")
    fun `updateStatus deve lançar IllegalArgumentException quando motivo for nulo ou vazio`() {
        // Configure the mock to return a valid status for the findById call
        val status = Status(1, "Ativo", "Verde", "Motivo 1")
        every { repository.findById(1) } returns Optional.of(status)

        // Test for empty motivo
        val exception1 = assertThrows<IllegalArgumentException> {
            service.updateStatus(1, "")
        }
        assertEquals("O campo 'motivo' é obrigatório.", exception1.message)

        // Test for null motivo
        val exception2 = assertThrows<IllegalArgumentException> {
            service.updateStatus(1, null)
        }
        assertEquals("O campo 'motivo' é obrigatório.", exception2.message)
    }

    @Test
    @DisplayName("Deve retornar null ao tentar atualizar um status inexistente")
    fun `updateStatus deve retornar null quando Status nao for encontrado`() {
        every { repository.findById(1) } returns Optional.empty()

        val result = service.updateStatus(1, "Motivo atualizado")

        assertNull(result)
        verify { repository.findById(1) }
    }
}

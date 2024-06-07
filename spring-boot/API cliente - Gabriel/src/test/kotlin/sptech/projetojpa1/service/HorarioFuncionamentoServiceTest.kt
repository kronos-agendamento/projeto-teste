package sptech.projetojpa1.service

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.Mockito
import org.mockito.junit.jupiter.MockitoExtension
import sptech.projetojpa1.dominio.HorarioFuncionamento
import sptech.projetojpa1.dto.horario.HorarioFuncionamentoRequest
import sptech.projetojpa1.repository.HorarioFuncionamentoRepository
import java.util.*

@ExtendWith(MockitoExtension::class)
class HorarioFuncionamentoServiceTest {

    @Mock
    private lateinit var repository: HorarioFuncionamentoRepository

    @InjectMocks
    private lateinit var service: HorarioFuncionamentoService

    @Test
    @DisplayName("Teste de cadastro de horário de funcionamento com dados válidos")
    fun `cadastrarHorarioFuncionamento should create and return HorarioFuncionamento`() {
        val novoHorarioRequest = HorarioFuncionamentoRequest(
            id = 0,
            diaSemana = "Segunda-feira",
            horarioAbertura = "08:00",
            horarioFechamento = "18:00"
        )
        val horarioFuncionamento = HorarioFuncionamento(
            codigo = 1,
            diaSemana = novoHorarioRequest.diaSemana,
            horarioAbertura = novoHorarioRequest.horarioAbertura,
            horarioFechamento = novoHorarioRequest.horarioFechamento
        )

        Mockito.`when`(repository.save(Mockito.any(HorarioFuncionamento::class.java)))
            .thenReturn(horarioFuncionamento)

        val result = service.cadastrarHorarioFuncionamento(novoHorarioRequest)

        assertNotNull(result)
        assertEquals(horarioFuncionamento.codigo, result.codigo)
        assertEquals(horarioFuncionamento.diaSemana, result.diaSemana)
        assertEquals(horarioFuncionamento.horarioAbertura, result.horarioAbertura)
        assertEquals(horarioFuncionamento.horarioFechamento, result.horarioFechamento)
    }

    @Test
    @DisplayName("Teste de listagem de todos os horários de funcionamento")
    fun `listarHorariosFuncionamento should return list of HorarioFuncionamento`() {
        val horario1 = HorarioFuncionamento(
            codigo = 1,
            diaSemana = "Segunda-feira",
            horarioAbertura = "08:00",
            horarioFechamento = "18:00"
        )
        val horario2 = HorarioFuncionamento(
            codigo = 2,
            diaSemana = "Terça-feira",
            horarioAbertura = "09:00",
            horarioFechamento = "17:00"
        )
        val horarios = listOf(horario1, horario2)

        Mockito.`when`(repository.findAll()).thenReturn(horarios)

        val result = service.listarHorariosFuncionamento()

        assertNotNull(result)
        assertEquals(2, result.size)
        assertEquals(horario1.codigo, result[0].codigo)
        assertEquals(horario1.diaSemana, result[0].diaSemana)
        assertEquals(horario1.horarioAbertura, result[0].horarioAbertura)
        assertEquals(horario1.horarioFechamento, result[0].horarioFechamento)
        assertEquals(horario2.codigo, result[1].codigo)
        assertEquals(horario2.diaSemana, result[1].diaSemana)
        assertEquals(horario2.horarioAbertura, result[1].horarioAbertura)
        assertEquals(horario2.horarioFechamento, result[1].horarioFechamento)
    }

    @Test
    @DisplayName("Teste de exclusão de horário de funcionamento existente")
    fun `excluirHorarioFuncionamento should return true if horario exists`() {
        val id = 1
        Mockito.`when`(repository.existsById(id)).thenReturn(true)

        val result = service.excluirHorarioFuncionamento(id)

        assertTrue(result)
        Mockito.verify(repository).deleteById(id)
    }

    @Test
    @DisplayName("Teste de tentativa de exclusão de horário de funcionamento inexistente")
    fun `excluirHorarioFuncionamento should return false if horario does not exist`() {
        val id = 1
        Mockito.`when`(repository.existsById(id)).thenReturn(false)

        val result = service.excluirHorarioFuncionamento(id)

        assertFalse(result)
        Mockito.verify(repository, Mockito.never()).deleteById(id)
    }

    @Test
    @DisplayName("Teste de atualização de horário de abertura de funcionamento")
    fun `atualizarHorarioAbertura should return true if horario exists`() {
        val id = 1
        val novoHorarioAbertura = "09:00"
        val horario = HorarioFuncionamento(
            codigo = id,
            diaSemana = "Segunda-feira",
            horarioAbertura = "08:00",
            horarioFechamento = "18:00"
        )
        Mockito.`when`(repository.findById(id)).thenReturn(Optional.of(horario))

        val result = service.atualizarHorarioAbertura(id, novoHorarioAbertura)

        assertTrue(result)
        assertEquals(novoHorarioAbertura, horario.horarioAbertura)
        Mockito.verify(repository).save(horario)
    }

    @Test
    @DisplayName("Teste de tentativa de atualização de horário de abertura de funcionamento inexistente")
    fun `atualizarHorarioAbertura should return false if horario does not exist`() {
        val id = 1
        val novoHorarioAbertura = "09:00"
        Mockito.`when`(repository.findById(id)).thenReturn(Optional.empty())

        val result = service.atualizarHorarioAbertura(id, novoHorarioAbertura)

        assertFalse(result)
        Mockito.verify(repository, Mockito.never()).save(Mockito.any())
    }

    @Test
    @DisplayName("Teste de atualização de horário de fechamento de funcionamento")
    fun `atualizarHorarioFechamento should return true if horario exists`() {
        val id = 1
        val novoHorarioFechamento = "19:00"
        val horario = HorarioFuncionamento(
            codigo = id,
            diaSemana = "Segunda-feira",
            horarioAbertura = "08:00",
            horarioFechamento = "18:00"
        )
        Mockito.`when`(repository.findById(id)).thenReturn(Optional.of(horario))

        val result = service.atualizarHorarioFechamento(id, novoHorarioFechamento)

        assertTrue(result)
        assertEquals(novoHorarioFechamento, horario.horarioFechamento)
        Mockito.verify(repository).save(horario)
    }

    @Test
    @DisplayName("Teste de tentativa de atualização de horário de fechamento de funcionamento inexistente")
    fun `atualizarHorarioFechamento should return false if horario does not exist`() {
        val id = 1
        val novoHorarioFechamento = "19:00"
        Mockito.`when`(repository.findById(id)).thenReturn(Optional.empty())

        val result = service.atualizarHorarioFechamento(id, novoHorarioFechamento)

        assertFalse(result)
        Mockito.verify(repository, Mockito.never()).save(Mockito.any())
    }
}

package sptech.projetojpa1.service

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.Mockito
import org.mockito.junit.jupiter.MockitoExtension
import sptech.projetojpa1.dominio.Agendamento
import sptech.projetojpa1.dominio.Feedback
import sptech.projetojpa1.dominio.Usuario
import sptech.projetojpa1.dominio.Procedimento
import sptech.projetojpa1.dominio.Status
import sptech.projetojpa1.dto.feedback.FeedbackRequestDTO
import sptech.projetojpa1.dto.feedback.FeedbackResponseDTO
import sptech.projetojpa1.repository.AgendamentoRepository
import sptech.projetojpa1.repository.FeedbackRepository
import sptech.projetojpa1.repository.UsuarioRepository
import java.sql.Timestamp
import java.time.LocalDate
import java.util.*

@ExtendWith(MockitoExtension::class)
class FeedbackServiceTest {

    @Mock
    private lateinit var feedbackRepository: FeedbackRepository

    @Mock
    private lateinit var usuarioRepository: UsuarioRepository

    @Mock
    private lateinit var agendamentoRepository: AgendamentoRepository

    @InjectMocks
    private lateinit var feedbackService: FeedbackService

    @Test
    @DisplayName("Teste de criação de feedback com dados válidos")
    fun `criarFeedback should create and return FeedbackResponseDTO`() {
        val usuario = Usuario(
            codigo = 1,
            nome = "John Doe",
            email = "john.doe@example.com",
            senha = "password",
            instagram = "johndoe",
            cpf = "12345678900",
            telefone = 1234567890,
            telefoneEmergencial = 1234567890,
            dataNasc = LocalDate.of(1990, 1, 1),
            genero = "M",
            indicacao = "Friend",
            foto = null,
            status = true,
            nivelAcesso = null,
            endereco = null,
            empresa = null,
            fichaAnamnese = null
        )
        val procedimento = Procedimento(
            idProcedimento = 1,
            tipo = "Tipo A",
            descricao = "Consulta"
        )
        val statusAgendamento = Status(
            id = 1,
            nome = "Agendado",
            cor = "#000000",
            motivo = "Agendado"
        )
        val agendamento = Agendamento(
            idAgendamento = 1,
            data = Date(),
            horario = Timestamp(System.currentTimeMillis()),
            tipoAgendamento = 1,
            usuario = usuario,
            procedimento = procedimento,
            statusAgendamento = statusAgendamento
        )
        val feedbackRequestDTO = FeedbackRequestDTO(
            anotacoes = "Bom atendimento",
            nota = 5,
            agendamentoId = 1,
            usuarioId = 1
        )
        val feedback = Feedback(
            anotacoes = feedbackRequestDTO.anotacoes,
            nota = feedbackRequestDTO.nota,
            agendamento = agendamento,
            usuario = usuario
        )

        Mockito.`when`(usuarioRepository.findById(1)).thenReturn(Optional.of(usuario))
        Mockito.`when`(agendamentoRepository.findById(1)).thenReturn(Optional.of(agendamento))
        Mockito.`when`(feedbackRepository.save(Mockito.any(Feedback::class.java))).thenReturn(feedback)

        val result = feedbackService.criarFeedback(feedbackRequestDTO)

        assertNotNull(result)
        assertEquals(feedback.anotacoes, result.anotacoes)
        assertEquals(feedback.nota, result.nota)
        assertEquals(feedback.agendamento?.idAgendamento, result.agendamentoId)
        assertEquals(feedback.usuario?.codigo, result.usuarioId)
    }

    @Test
    @DisplayName("Teste de busca de feedback por ID")
    fun `buscarFeedbackPorId should return FeedbackResponseDTO`() {
        val usuario = Usuario(
            codigo = 1,
            nome = "John Doe",
            email = "john.doe@example.com",
            senha = "password",
            instagram = "johndoe",
            cpf = "12345678900",
            telefone = 1234567890,
            telefoneEmergencial = 1234567890,
            dataNasc = LocalDate.of(1990, 1, 1),
            genero = "M",
            indicacao = "Friend",
            foto = null,
            status = true,
            nivelAcesso = null,
            endereco = null,
            empresa = null,
            fichaAnamnese = null
        )
        val procedimento = Procedimento(
            idProcedimento = 1,
            tipo = "Tipo A",
            descricao = "Consulta"
        )
        val statusAgendamento = Status(
            id = 1,
            nome = "Agendado",
            cor = "#000000",
            motivo = "Agendado"
        )
        val agendamento = Agendamento(
            idAgendamento = 1,
            data = Date(),
            horario = Timestamp(System.currentTimeMillis()),
            tipoAgendamento = 1,
            usuario = usuario,
            procedimento = procedimento,
            statusAgendamento = statusAgendamento
        )
        val feedback = Feedback(
            anotacoes = "Bom atendimento",
            nota = 5,
            agendamento = agendamento,
            usuario = usuario
        )

        Mockito.`when`(feedbackRepository.findById(1)).thenReturn(Optional.of(feedback))

        val result = feedbackService.buscarFeedbackPorId(1)

        assertNotNull(result)
        assertEquals(feedback.anotacoes, result?.anotacoes)
        assertEquals(feedback.nota, result?.nota)
        assertEquals(feedback.agendamento?.idAgendamento, result?.agendamentoId)
        assertEquals(feedback.usuario?.codigo, result?.usuarioId)
    }

    @Test
    @DisplayName("Teste de atualização de feedback com dados válidos")
    fun `atualizarFeedback should update and return FeedbackResponseDTO`() {
        val usuario = Usuario(
            codigo = 1,
            nome = "John Doe",
            email = "john.doe@example.com",
            senha = "password",
            instagram = "johndoe",
            cpf = "12345678900",
            telefone = 1234567890,
            telefoneEmergencial = 1234567890,
            dataNasc = LocalDate.of(1990, 1, 1),
            genero = "M",
            indicacao = "Friend",
            foto = null,
            status = true,
            nivelAcesso = null,
            endereco = null,
            empresa = null,
            fichaAnamnese = null
        )
        val procedimento = Procedimento(
            idProcedimento = 1,
            tipo = "Tipo A",
            descricao = "Consulta"
        )
        val statusAgendamento = Status(
            id = 1,
            nome = "Agendado",
            cor = "#000000",
            motivo = "Agendado"
        )
        val agendamento = Agendamento(
            idAgendamento = 1,
            data = Date(),
            horario = Timestamp(System.currentTimeMillis()),
            tipoAgendamento = 1,
            usuario = usuario,
            procedimento = procedimento,
            statusAgendamento = statusAgendamento
        )
        val feedbackExistente = Feedback(
            anotacoes = "Bom atendimento",
            nota = 5,
            agendamento = agendamento,
            usuario = usuario
        )
        val feedbackRequestDTO = FeedbackRequestDTO(
            anotacoes = "Excelente atendimento",
            nota = 5,
            agendamentoId = 1,
            usuarioId = 1
        )
        val feedbackAtualizado = feedbackExistente.copy(
            anotacoes = feedbackRequestDTO.anotacoes,
            nota = feedbackRequestDTO.nota
        )

        Mockito.`when`(feedbackRepository.findById(1)).thenReturn(Optional.of(feedbackExistente))
        Mockito.`when`(feedbackRepository.save(Mockito.any(Feedback::class.java))).thenReturn(feedbackAtualizado)

        val result = feedbackService.atualizarFeedback(1, feedbackRequestDTO)

        assertNotNull(result)
        assertEquals(feedbackRequestDTO.anotacoes, result?.anotacoes)
        assertEquals(feedbackRequestDTO.nota, result?.nota)
        assertEquals(feedbackRequestDTO.agendamentoId, result?.agendamentoId)
        assertEquals(feedbackRequestDTO.usuarioId, result?.usuarioId)
    }

    @Test
    @DisplayName("Teste de exclusão de feedback existente")
    fun `deletarFeedback should delete the feedback`() {
        Mockito.`when`(feedbackRepository.existsById(1)).thenReturn(true)

        feedbackService.deletarFeedback(1)

        Mockito.verify(feedbackRepository).deleteById(1)
    }
}

package sptech.projetojpa1.service

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.Mockito.*
import org.mockito.junit.jupiter.MockitoExtension
import sptech.projetojpa1.dominio.Agendamento
import sptech.projetojpa1.dto.agendamento.AgendamentoRequestDTO
import sptech.projetojpa1.repository.AgendamentoRepository
import sptech.projetojpa1.repository.ProcedimentoRepository
import sptech.projetojpa1.repository.StatusRepository
import sptech.projetojpa1.repository.UsuarioRepository
import sptech.projetojpa1.service.AgendamentoService
import java.sql.Timestamp
import java.util.Optional
import java.text.SimpleDateFormat

@ExtendWith(MockitoExtension::class)
class AgendamentoServiceTest {

    @Mock
    private lateinit var agendamentoRepository: AgendamentoRepository

    @Mock
    private lateinit var usuarioRepository: UsuarioRepository

    @Mock
    private lateinit var procedimentoRepository: ProcedimentoRepository

    @Mock
    private lateinit var statusRepository: StatusRepository

    @InjectMocks
    private lateinit var agendamentoService: AgendamentoService

    private lateinit var agendamentoRequestDTO: AgendamentoRequestDTO
    private lateinit var agendamento: Agendamento

    private val dateFormat = SimpleDateFormat("yyyy-MM-dd")
    private val timeFormat = SimpleDateFormat("HH:mm")


    @BeforeEach
    fun setUp() {
        agendamentoRequestDTO = AgendamentoRequestDTO(
            idAgendamento = 1,
            data = dateFormat.parse("2023-05-27"),
            horario = Timestamp(timeFormat.parse("14:00").time),
            tipoAgendamento = 1,
            fk_usuario = 1,
            fk_procedimento = 1,
            fk_status = 1
        )

        agendamento = Agendamento(
            idAgendamento = 1,
            data = dateFormat.parse("2023-05-27"),
            horario = Timestamp(timeFormat.parse("14:00").time),
            tipoAgendamento = 1,
            usuario = mock(),
            procedimento = mock(),
            statusAgendamento = mock()
        )
    }

    @Test
    @DisplayName("Teste para verificar a criação de um agendamento")
    fun `test criarAgendamento`() {
        `when`(usuarioRepository.findById(agendamentoRequestDTO.fk_usuario)).thenReturn(Optional.of(agendamento.usuario))
        `when`(procedimentoRepository.findById(agendamentoRequestDTO.fk_procedimento)).thenReturn(
            Optional.of(
                agendamento.procedimento
            )
        )
        `when`(statusRepository.findById(agendamentoRequestDTO.fk_status)).thenReturn(Optional.of(agendamento.statusAgendamento))
        `when`(agendamentoRepository.save(any(Agendamento::class.java))).thenReturn(agendamento)

        val response = agendamentoService.criarAgendamento(agendamentoRequestDTO)

        assertNotNull(response)
        assertEquals(agendamento.idAgendamento, response.idAgendamento)
        assertEquals(agendamento.data, response.data)
        assertEquals(agendamento.horario, response.horario)
        assertEquals(agendamento.tipoAgendamento, response.tipoAgendamento)
    }

    @Test
    @DisplayName("Teste para obter um agendamento específico")
    fun `test obterAgendamento`() {
        `when`(agendamentoRepository.findById(1)).thenReturn(Optional.of(agendamento))

        val response = agendamentoService.obterAgendamento(1)

        assertNotNull(response)
        assertEquals(agendamento.idAgendamento, response.idAgendamento)
        assertEquals(agendamento.data, response.data)
        assertEquals(agendamento.horario, response.horario)
        assertEquals(agendamento.tipoAgendamento, response.tipoAgendamento)
    }

    @Test
    @DisplayName("Teste para atualizar um agendamento existente")
    fun `test atualizarAgendamento`() {
        `when`(agendamentoRepository.findById(1)).thenReturn(Optional.of(agendamento))
        `when`(usuarioRepository.findById(agendamentoRequestDTO.fk_usuario)).thenReturn(Optional.of(agendamento.usuario))
        `when`(procedimentoRepository.findById(agendamentoRequestDTO.fk_procedimento)).thenReturn(
            Optional.of(
                agendamento.procedimento
            )
        )
        `when`(statusRepository.findById(agendamentoRequestDTO.fk_status)).thenReturn(Optional.of(agendamento.statusAgendamento))
        `when`(agendamentoRepository.save(any(Agendamento::class.java))).thenReturn(agendamento)

        val response = agendamentoService.atualizarAgendamento(1, agendamentoRequestDTO)

        assertNotNull(response)
        assertEquals(agendamento.idAgendamento, response.idAgendamento)
        assertEquals(agendamento.data, response.data)
        assertEquals(agendamento.horario, response.horario)
        assertEquals(agendamento.tipoAgendamento, response.tipoAgendamento)
    }

    @Test
    @DisplayName("Teste para excluir um agendamento")
    fun `test excluirAgendamento`() {
        `when`(agendamentoRepository.existsById(1)).thenReturn(true)

        assertDoesNotThrow { agendamentoService.excluirAgendamento(1) }

        verify(agendamentoRepository, times(1)).deleteById(1)
    }

    @Test
    @DisplayName("Teste para listar todos os agendamentos")
    fun `test listarTodosAgendamentos`() {
        `when`(agendamentoRepository.findAll()).thenReturn(listOf(agendamento))

        val responseList = agendamentoService.listarTodosAgendamentos()

        assertNotNull(responseList)
        assertEquals(1, responseList.size)
        assertEquals(agendamento.idAgendamento, responseList[0].idAgendamento)
        assertEquals(agendamento.data, responseList[0].data)
        assertEquals(agendamento.horario, responseList[0].horario)
        assertEquals(agendamento.tipoAgendamento, responseList[0].tipoAgendamento)
    }
}

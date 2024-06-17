package sptech.projetojpa1.service

import org.springframework.stereotype.Service
import sptech.projetojpa1.dominio.Agendamento
import sptech.projetojpa1.dto.agendamento.AgendamentoRequestDTO
import sptech.projetojpa1.dto.agendamento.AgendamentoResponseDTO
import sptech.projetojpa1.repository.AgendamentoRepository
import sptech.projetojpa1.repository.ProcedimentoRepository
import sptech.projetojpa1.repository.StatusRepository
import sptech.projetojpa1.repository.UsuarioRepository
import java.util.*

@Service
class AgendamentoService(
    private val agendamentoRepository: AgendamentoRepository,
    private val usuarioRepository: UsuarioRepository,
    private val procedimentoRepository: ProcedimentoRepository,
    private val statusRepository: StatusRepository
) {

    fun listarTodosAgendamentos(): List<AgendamentoResponseDTO> {
        val agendamentos = agendamentoRepository.findAll()

        return agendamentos.map { agendamento ->
            AgendamentoResponseDTO(
                idAgendamento = agendamento.idAgendamento,
                data = agendamento.data,
                horario = agendamento.horario,
                tipoAgendamento = agendamento.tipoAgendamento,
                usuario = agendamento.usuario,
                procedimento = agendamento.procedimento,
                statusAgendamento = agendamento.statusAgendamento
            )
        }
    }

    fun listarAgendamento(): List<Agendamento> {
        val agendamentos = agendamentoRepository.findAll()

        return agendamentos
    }

    fun validarDiaHora(data: Date, horario: Date): Boolean {
        val agendamentos = agendamentoRepository.findByDataAndHorario(data, horario)
        return agendamentos.isEmpty()

        // true: Não existem agendamentos na data e horário especificados.
        // false: Existe um agendamento na data e horário especificados.
    }

    fun validarAgendamento(agendamentoRequestDTO: AgendamentoRequestDTO): Boolean {
        val dataAgendamento = agendamentoRequestDTO.data
        val horaAgendamento = agendamentoRequestDTO.horario

        // Verifica se dataAgendamento ou horaAgendamento são nulos e lança uma exceção
        if (dataAgendamento == null || horaAgendamento == null) {
            throw IllegalArgumentException("Data e horário do agendamento não podem ser nulos")
        }

        return validarDiaHora(dataAgendamento, horaAgendamento)
    }

    fun criarAgendamento(agendamentoRequestDTO: AgendamentoRequestDTO): AgendamentoResponseDTO {
        val agendamento = Agendamento(
            data = agendamentoRequestDTO.data ?: throw IllegalArgumentException("Data não pode ser nula"),
            horario = agendamentoRequestDTO.horario
                ?: throw IllegalArgumentException("Horário não pode ser nulo"),
            tipoAgendamento = agendamentoRequestDTO.tipoAgendamento
                ?: throw IllegalArgumentException("Tipo de agendamento não pode ser nulo"),
            usuario = usuarioRepository.findById(agendamentoRequestDTO.fk_usuario)
                .orElseThrow { IllegalArgumentException("Usuário não encontrado") },
            procedimento = procedimentoRepository.findById(agendamentoRequestDTO.fk_procedimento)
                .orElseThrow { IllegalArgumentException("Procedimento não encontrado") },
            statusAgendamento = statusRepository.findById(agendamentoRequestDTO.fk_status)
                .orElseThrow { IllegalArgumentException("Status não encontrado") }
        )

        val savedAgendamento = agendamentoRepository.save(agendamento)

        return AgendamentoResponseDTO(
            idAgendamento = savedAgendamento.idAgendamento,
            data = savedAgendamento.data,
            horario = savedAgendamento.horario,
            tipoAgendamento = savedAgendamento.tipoAgendamento,
            usuario = savedAgendamento.usuario,
            procedimento = savedAgendamento.procedimento,
            statusAgendamento = savedAgendamento.statusAgendamento
        )
    }

    fun obterAgendamento(id: Int): AgendamentoResponseDTO {
        val agendamento =
            agendamentoRepository.findById(id)
                .orElseThrow { IllegalArgumentException("Agendamento não encontrado") }

        return AgendamentoResponseDTO(
            idAgendamento = agendamento.idAgendamento,
            data = agendamento.data,
            horario = agendamento.horario,
            tipoAgendamento = agendamento.tipoAgendamento,
            usuario = agendamento.usuario,
            procedimento = agendamento.procedimento,
            statusAgendamento = agendamento.statusAgendamento
        )
    }

    fun atualizarAgendamento(id: Int, agendamentoRequestDTO: AgendamentoRequestDTO): AgendamentoResponseDTO {
        val agendamento =
            agendamentoRepository.findById(id)
                .orElseThrow { IllegalArgumentException("Agendamento não encontrado") }

        agendamento.data =
            agendamentoRequestDTO.data ?: throw IllegalArgumentException("Data não pode ser nula")
        agendamento.horario =
            agendamentoRequestDTO.horario ?: throw IllegalArgumentException("Horário não pode ser nulo")
        agendamento.tipoAgendamento = agendamentoRequestDTO.tipoAgendamento
            ?: throw IllegalArgumentException("Tipo de agendamento não pode ser nulo")
        agendamento.usuario = usuarioRepository.findById(agendamentoRequestDTO.fk_usuario)
            .orElseThrow { IllegalArgumentException("Usuário não encontrado") }
        agendamento.procedimento = procedimentoRepository.findById(agendamentoRequestDTO.fk_procedimento)
            .orElseThrow { IllegalArgumentException("Procedimento não encontrado") }
        agendamento.statusAgendamento = statusRepository.findById(agendamentoRequestDTO.fk_status)
            .orElseThrow { IllegalArgumentException("Status não encontrado") }

        val updatedAgendamento = agendamentoRepository.save(agendamento)

        return AgendamentoResponseDTO(
            idAgendamento = updatedAgendamento.idAgendamento,
            data = updatedAgendamento.data,
            horario = updatedAgendamento.horario,
            tipoAgendamento = updatedAgendamento.tipoAgendamento,
            usuario = updatedAgendamento.usuario,
            procedimento = updatedAgendamento.procedimento,
            statusAgendamento = updatedAgendamento.statusAgendamento
        )
    }

    fun excluirAgendamento(id: Int) {
        if (!agendamentoRepository.existsById(id)) {
            throw IllegalArgumentException("Agendamento não encontrado")
        }

        agendamentoRepository.deleteById(id)
    }

}
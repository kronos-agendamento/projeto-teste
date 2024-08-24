package sptech.projetojpa1.service

import org.springframework.stereotype.Service
import sptech.projetojpa1.dominio.Agendamento
import sptech.projetojpa1.dto.agendamento.AgendamentoRequestDTO
import sptech.projetojpa1.dto.agendamento.AgendamentoResponseDTO
import sptech.projetojpa1.repository.*
import java.time.LocalDateTime

@Service
class AgendamentoService(
    private val agendamentoRepository: AgendamentoRepository,
    private val usuarioRepository: UsuarioRepository,
    private val procedimentoRepository: ProcedimentoRepository,
    private val especificacaoRepository: EspecificacaoRepository,
    private val statusRepository: StatusRepository
) {

    fun listarTodosAgendamentos(): List<AgendamentoResponseDTO> {
        val agendamentos = agendamentoRepository.findAll()
        return agendamentos.map { agendamento ->
            AgendamentoResponseDTO(
                idAgendamento = agendamento.idAgendamento,
                dataHorario = agendamento.dataHorario,
                tipoAgendamento = agendamento.tipoAgendamento,
                usuario = agendamento.usuario,
                procedimento = agendamento.procedimento,
                especificacao = agendamento.especificacao,
                statusAgendamento = agendamento.statusAgendamento
            )
        }
    }

    fun agendamentosRealizadosTrimestre(): Int {
        val agendamentos = agendamentoRepository.findAgendamentosConcluidosUltimoTrimestre()

        return agendamentos
    }

    fun listarAgendamento(): List<Agendamento> {
        val agendamentos = agendamentoRepository.findAll()

        return agendamentos
    }

    fun validarDia(dataHorario: LocalDateTime): Boolean {
        val agendamentos = agendamentoRepository.findByDataHorario(dataHorario)
        return agendamentos.isEmpty()

        // true: Não existem agendamentos na data especificada.
        // false: Existe um agendamento na data especificada.
    }

    fun validarAgendamento(agendamentoRequestDTO: AgendamentoRequestDTO): Boolean {
        val dataInicio = agendamentoRequestDTO.dataHorario
            ?: throw IllegalArgumentException("Data do agendamento não pode ser nula")

        val especificacao = especificacaoRepository.findById(agendamentoRequestDTO.fk_especificacao)
            .orElseThrow { IllegalArgumentException("Especificação não encontrada") }

        val tempoProcedimento = especificacao.fkTempoProcedimento
            ?: throw IllegalArgumentException("Tempo do procedimento não pode ser nulo")

        val duracao = when (agendamentoRequestDTO.tipoAgendamento) {
            "Colocação" -> tempoProcedimento.tempoColocacao
            "Manutenção" -> tempoProcedimento.tempoManutencao
            "Retirada" -> tempoProcedimento.tempoRetirada
            else -> throw IllegalArgumentException("Tipo de agendamento inválido")
        }

        val duracaoHorasMinutos = duracao.split(":")
        val horas = duracaoHorasMinutos[0].toInt()
        val minutos = duracaoHorasMinutos[1].toInt()

        val dataFim = dataInicio.plusHours(horas.toLong()).plusMinutes(minutos.toLong())

        return validarDia(dataInicio)
    }

    fun criarAgendamento(agendamentoRequestDTO: AgendamentoRequestDTO): AgendamentoResponseDTO {
        if (!validarAgendamento(agendamentoRequestDTO)) {
            throw IllegalArgumentException("Já existe um agendamento para esse horário")
        }

        val agendamento = Agendamento(
            dataHorario = agendamentoRequestDTO.dataHorario
                ?: throw IllegalArgumentException("Data não pode ser nula"),
            tipoAgendamento = agendamentoRequestDTO.tipoAgendamento
                ?: throw IllegalArgumentException("Tipo de agendamento não pode ser nulo"),
            usuario = usuarioRepository.findById(agendamentoRequestDTO.fk_usuario)
                .orElseThrow { IllegalArgumentException("Usuário não encontrado") },
            procedimento = procedimentoRepository.findById(agendamentoRequestDTO.fk_procedimento)
                .orElseThrow { IllegalArgumentException("Procedimento não encontrado") },
            especificacao = especificacaoRepository.findById(agendamentoRequestDTO.fk_especificacao)
                .orElseThrow { IllegalArgumentException("Especificação não encontrada") },
            statusAgendamento = statusRepository.findById(agendamentoRequestDTO.fk_status)
                .orElseThrow { IllegalArgumentException("Status não encontrado") }
        )

        val savedAgendamento = agendamentoRepository.save(agendamento)

        return AgendamentoResponseDTO(
            idAgendamento = savedAgendamento.idAgendamento,
            dataHorario = savedAgendamento.dataHorario,
            tipoAgendamento = savedAgendamento.tipoAgendamento,
            usuario = savedAgendamento.usuario,
            procedimento = savedAgendamento.procedimento,
            especificacao = savedAgendamento.especificacao,
            statusAgendamento = savedAgendamento.statusAgendamento
        )
    }

    fun obterAgendamento(id: Int): AgendamentoResponseDTO {
        val agendamento =
            agendamentoRepository.findById(id)
                .orElseThrow { IllegalArgumentException("Agendamento não encontrado") }

        return AgendamentoResponseDTO(
            idAgendamento = agendamento.idAgendamento,
            dataHorario = agendamento.dataHorario,
            tipoAgendamento = agendamento.tipoAgendamento,
            usuario = agendamento.usuario,
            procedimento = agendamento.procedimento,
            especificacao = agendamento.especificacao,
            statusAgendamento = agendamento.statusAgendamento
        )
    }

    fun atualizarAgendamento(id: Int, agendamentoRequestDTO: AgendamentoRequestDTO): AgendamentoResponseDTO {
        val agendamento =
            agendamentoRepository.findById(id)
                .orElseThrow { IllegalArgumentException("Agendamento não encontrado") }

        agendamento.dataHorario =
            agendamentoRequestDTO.dataHorario ?: throw IllegalArgumentException("Data não pode ser nula")
        agendamento.tipoAgendamento = agendamentoRequestDTO.tipoAgendamento
            ?: throw IllegalArgumentException("Tipo de agendamento não pode ser nulo")
        agendamento.usuario = usuarioRepository.findById(agendamentoRequestDTO.fk_usuario)
            .orElseThrow { IllegalArgumentException("Usuário não encontrado") }
        agendamento.procedimento = procedimentoRepository.findById(agendamentoRequestDTO.fk_procedimento)
            .orElseThrow { IllegalArgumentException("Procedimento não encontrado") }
        agendamento.especificacao = especificacaoRepository.findById(agendamentoRequestDTO.fk_especificacao)
            .orElseThrow { IllegalArgumentException("Especificação não encontrada") }
        agendamento.statusAgendamento = statusRepository.findById(agendamentoRequestDTO.fk_status)
            .orElseThrow { IllegalArgumentException("Status não encontrado") }

        val updatedAgendamento = agendamentoRepository.save(agendamento)

        return AgendamentoResponseDTO(
            idAgendamento = updatedAgendamento.idAgendamento,
            dataHorario = updatedAgendamento.dataHorario,
            tipoAgendamento = updatedAgendamento.tipoAgendamento,
            usuario = updatedAgendamento.usuario,
            procedimento = updatedAgendamento.procedimento,
            especificacao = updatedAgendamento.especificacao,
            statusAgendamento = updatedAgendamento.statusAgendamento
        )
    }

    fun atualizarStatusAgendamento(id: Int, novoStatusId: Int): AgendamentoResponseDTO {
        val agendamento = agendamentoRepository.findById(id)
            .orElseThrow { IllegalArgumentException("Agendamento não encontrado") }

        val novoStatus = statusRepository.findById(novoStatusId)
            .orElseThrow { IllegalArgumentException("Status não encontrado") }

        agendamento.statusAgendamento = novoStatus

        val updatedAgendamento = agendamentoRepository.save(agendamento)

        return AgendamentoResponseDTO(
            idAgendamento = updatedAgendamento.idAgendamento,
            dataHorario = updatedAgendamento.dataHorario,
            tipoAgendamento = updatedAgendamento.tipoAgendamento,
            usuario = updatedAgendamento.usuario,
            procedimento = updatedAgendamento.procedimento,
            especificacao = updatedAgendamento.especificacao,
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

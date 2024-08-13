package sptech.projetojpa1.service

import org.springframework.stereotype.Service
import sptech.projetojpa1.dominio.Agendamento
import sptech.projetojpa1.dto.agendamento.AgendamentoRequestDTO
import sptech.projetojpa1.dto.agendamento.AgendamentoResponseDTO
import sptech.projetojpa1.repository.AgendamentoRepository
import sptech.projetojpa1.repository.EspecificacaoRepository  // Novo repositório
import sptech.projetojpa1.repository.ProcedimentoRepository
import sptech.projetojpa1.repository.StatusRepository
import sptech.projetojpa1.repository.UsuarioRepository
import java.util.*

@Service
class AgendamentoService(
    private val agendamentoRepository: AgendamentoRepository,
    private val usuarioRepository: UsuarioRepository,
    private val procedimentoRepository: ProcedimentoRepository,
    private val especificacaoRepository: EspecificacaoRepository,  // Novo repositório
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
                especificacao = agendamento.especificacao,  // Novo campo
                statusAgendamento = agendamento.statusAgendamento
            )
        }
    }

    fun agendamentosRealizadosTrimestre(): Int{
        val agendamentos = agendamentoRepository.findAgendamentosConcluidosUltimoTrimestre()

        return agendamentos
    }

    fun listarAgendamento(): List<Agendamento> {
        val agendamentos = agendamentoRepository.findAll()

        return agendamentos
    }

    fun validarDia(dataHorario: Date): Boolean {
        val agendamentos = agendamentoRepository.findByDataHorario(dataHorario)
        return agendamentos.isEmpty()

        // true: Não existem agendamentos na data especificada.
        // false: Existe um agendamento na data especificada.
    }

    fun validarAgendamento(agendamentoRequestDTO: AgendamentoRequestDTO): Boolean {
        val dataAgendamento = agendamentoRequestDTO.dataHorario

        // Verifica se dataAgendamento é nulo e lança uma exceção
        if (dataAgendamento == null) {
            throw IllegalArgumentException("Data do agendamento não pode ser nula")
        }

        return validarDia(dataAgendamento)
    }

    fun criarAgendamento(agendamentoRequestDTO: AgendamentoRequestDTO): AgendamentoResponseDTO {
        val agendamento = Agendamento(
            dataHorario = agendamentoRequestDTO.dataHorario ?: throw IllegalArgumentException("Data não pode ser nula"),
            tipoAgendamento = agendamentoRequestDTO.tipoAgendamento ?: throw IllegalArgumentException("Tipo de agendamento não pode ser nulo"),
            usuario = usuarioRepository.findById(agendamentoRequestDTO.fk_usuario).orElseThrow { IllegalArgumentException("Usuário não encontrado") },
            procedimento = procedimentoRepository.findById(agendamentoRequestDTO.fk_procedimento).orElseThrow { IllegalArgumentException("Procedimento não encontrado") },
            especificacao = especificacaoRepository.findById(agendamentoRequestDTO.fk_especificacao).orElseThrow { IllegalArgumentException("Especificação não encontrada") },  // Novo campo
            statusAgendamento = statusRepository.findById(agendamentoRequestDTO.fk_status).orElseThrow { IllegalArgumentException("Status não encontrado") }
        )

        val savedAgendamento = agendamentoRepository.save(agendamento)

        return AgendamentoResponseDTO(
            idAgendamento = savedAgendamento.idAgendamento,
            dataHorario = savedAgendamento.dataHorario,
            tipoAgendamento = savedAgendamento.tipoAgendamento,
            usuario = savedAgendamento.usuario,
            procedimento = savedAgendamento.procedimento,
            especificacao = savedAgendamento.especificacao,  // Novo campo
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
            especificacao = agendamento.especificacao,  // Novo campo
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
            .orElseThrow { IllegalArgumentException("Especificação não encontrada") }  // Novo campo
        agendamento.statusAgendamento = statusRepository.findById(agendamentoRequestDTO.fk_status)
            .orElseThrow { IllegalArgumentException("Status não encontrado") }

        val updatedAgendamento = agendamentoRepository.save(agendamento)

        return AgendamentoResponseDTO(
            idAgendamento = updatedAgendamento.idAgendamento,
            dataHorario = updatedAgendamento.dataHorario,
            tipoAgendamento = updatedAgendamento.tipoAgendamento,
            usuario = updatedAgendamento.usuario,
            procedimento = updatedAgendamento.procedimento,
            especificacao = updatedAgendamento.especificacao,  // Novo campo
            statusAgendamento = updatedAgendamento.statusAgendamento
        )
    }

    // Adicione o método abaixo na classe AgendamentoService

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

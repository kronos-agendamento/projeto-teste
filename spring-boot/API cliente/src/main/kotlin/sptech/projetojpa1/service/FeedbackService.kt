package sptech.projetojpa1.service

import org.springframework.stereotype.Service
import sptech.projetojpa1.domain.Feedback
import sptech.projetojpa1.domain.usuario.Cliente
import sptech.projetojpa1.domain.usuario.Profissional
import sptech.projetojpa1.dto.feedback.FeedbackRequestDTO
import sptech.projetojpa1.dto.feedback.FeedbackResponseDTO
import sptech.projetojpa1.repository.AgendamentoRepository
import sptech.projetojpa1.repository.FeedbackRepository
import sptech.projetojpa1.repository.UsuarioRepository

@Service
class FeedbackService(
    private val feedbackRepository: FeedbackRepository,
    private val usuarioRepository: UsuarioRepository,
    private val agendamentoRepository: AgendamentoRepository
) {

    fun criarFeedback(feedbackRequestDTO: FeedbackRequestDTO): FeedbackResponseDTO {
        val usuario = usuarioRepository.findById(feedbackRequestDTO.usuario)
            .orElseThrow { IllegalArgumentException("Usuário não encontrado") }
        val agendamento = agendamentoRepository.findById(feedbackRequestDTO.agendamentoId)
            .orElseThrow { IllegalArgumentException("Agendamento não encontrado") }

        if (feedbackRequestDTO.anotacoes.isNullOrBlank()) {
            throw IllegalArgumentException("Anotações não podem ser nulas ou em branco")
        }

        if (feedbackRequestDTO.nota == null || feedbackRequestDTO.nota < 1 || feedbackRequestDTO.nota > 5) {
            throw IllegalArgumentException("Nota deve ser entre 1 e 5")
        }

        val clienteAvaliado = when (usuario) {
            is Profissional -> {
                val cliente = usuarioRepository.findById(feedbackRequestDTO.clienteAvaliado!!)
                    .orElseThrow { IllegalArgumentException("Cliente avaliado não encontrado") }
                if (cliente !is Cliente) {
                    throw IllegalArgumentException("Somente clientes podem ser avaliados por profissionais")
                }
                cliente
            }
            is Cliente -> null // Clientes não avaliam outros clientes.
            else -> throw IllegalArgumentException("Tipo de usuário não suportado para avaliação")
        }

        val feedback = Feedback(
            anotacoes = feedbackRequestDTO.anotacoes,
            nota = feedbackRequestDTO.nota,
            agendamento = agendamento,
            usuario = usuario,
            clienteAvaliado = clienteAvaliado
        )

        val savedFeedback = feedbackRepository.save(feedback)
        return FeedbackResponseDTO(
            idFeedback = savedFeedback.idFeedback,
            anotacoes = savedFeedback.anotacoes,
            nota = savedFeedback.nota,
            agendamento = savedFeedback.agendamento?.idAgendamento ?: 0,
            usuario = savedFeedback.usuario?.codigo ?: 0
        )
    }


    fun buscarMediaNotas(): List<Double> {
        return feedbackRepository.buscarMediaNotas()
    }

    fun buscarMediaNotasSingle(startDate: String?, endDate: String?): Double {
        return feedbackRepository.buscarMediaNotasSingle(startDate, endDate)
    }



    fun buscarFeedbackPorId(id: Int): FeedbackResponseDTO? {
        val feedback = feedbackRepository.findById(id).orElse(null) ?: return null
        return FeedbackResponseDTO(
            idFeedback = feedback.idFeedback,
            anotacoes = feedback.anotacoes,
            nota = feedback.nota,
            agendamento = feedback.agendamento?.idAgendamento ?: 0,
            usuario = feedback.usuario?.codigo ?: 0
        )
    }

    fun atualizarFeedback(id: Int, feedbackRequestDTO: FeedbackRequestDTO): FeedbackResponseDTO? {
        val feedbackExistente = feedbackRepository.findById(id).orElse(null) ?: return null

        val usuario = usuarioRepository.findById(feedbackRequestDTO.usuario)
            .orElseThrow { IllegalArgumentException("Usuário não encontrado") }
        val agendamento = agendamentoRepository.findById(feedbackRequestDTO.agendamentoId)
            .orElseThrow { IllegalArgumentException("Agendamento não encontrado") }

        val clienteAvaliado = when (usuario) {
            is Profissional -> null // Profissionais avaliam procedimentos, não clientes.
            is Cliente -> usuario  // Cliente avaliado.
            else -> throw IllegalArgumentException("Tipo de usuário não suportado para avaliação")
        }

        val feedbackAtualizado = feedbackExistente.copy(
            anotacoes = feedbackRequestDTO.anotacoes,
            nota = feedbackRequestDTO.nota,
            agendamento = agendamento,
            usuario = usuario,
            clienteAvaliado = clienteAvaliado
        )

        val savedFeedback = feedbackRepository.save(feedbackAtualizado)
        return FeedbackResponseDTO(
            idFeedback = savedFeedback.idFeedback,
            anotacoes = savedFeedback.anotacoes,
            nota = savedFeedback.nota,
            agendamento = savedFeedback.agendamento?.idAgendamento ?: 0,
            usuario = savedFeedback.usuario?.codigo ?: 0
        )
    }

    fun deletarFeedback(id: Int) {
        if (!feedbackRepository.existsById(id)) {
            throw IllegalArgumentException("Feedback não encontrado")
        }
        feedbackRepository.deleteById(id)
    }

    fun calcularMediaAvaliacoesCliente(clienteId: Int): Double? {
        val cliente =
            usuarioRepository.findById(clienteId).orElseThrow { IllegalArgumentException("Cliente não encontrado") }
        return if (cliente is Cliente) {
            val feedbacks = feedbackRepository.findAllByClienteAvaliado(cliente)
            if (feedbacks.isNotEmpty()) {
                feedbacks.mapNotNull { it.nota }.average()
            } else {
                null
            }
        } else {
            throw IllegalArgumentException("O usuário especificado não é um cliente")
        }
    }
}
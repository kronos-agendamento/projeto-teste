package sptech.projetojpa1.service

import org.springframework.stereotype.Service
import sptech.projetojpa1.dominio.Feedback
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
        val usuario = usuarioRepository.findById(feedbackRequestDTO.usuarioId)
            .orElseThrow { IllegalArgumentException("Usuário não encontrado") }
        val agendamento = agendamentoRepository.findById(feedbackRequestDTO.agendamentoId)
            .orElseThrow { IllegalArgumentException("Agendamento não encontrado") }

        if (feedbackRequestDTO.anotacoes.isNullOrBlank()) {
            throw IllegalArgumentException("Anotações não podem ser nulas ou em branco")
        }

        if (feedbackRequestDTO.nota == null || feedbackRequestDTO.nota < 1 || feedbackRequestDTO.nota > 5) {
            throw IllegalArgumentException("Nota deve ser entre 1 e 5")
        }

        val feedback = Feedback(
            anotacoes = feedbackRequestDTO.anotacoes,
            nota = feedbackRequestDTO.nota,
            agendamento = agendamento,
            usuario = usuario
        )
        val savedFeedback = feedbackRepository.save(feedback)
        return FeedbackResponseDTO(
            idFeedback = savedFeedback.idFeedback,
            anotacoes = savedFeedback.anotacoes,
            nota = savedFeedback.nota,
            agendamentoId = savedFeedback.agendamento?.idAgendamento ?: 0,
            usuarioId = savedFeedback.usuario?.codigo ?: 0
        )
    }

    fun buscarFeedbackPorId(id: Int): FeedbackResponseDTO? {
        val feedback = feedbackRepository.findById(id).orElse(null) ?: return null
        return FeedbackResponseDTO(
            idFeedback = feedback.idFeedback,
            anotacoes = feedback.anotacoes,
            nota = feedback.nota,
            agendamentoId = feedback.agendamento?.idAgendamento ?: 0,
            usuarioId = feedback.usuario?.codigo ?: 0
        )
    }

    fun atualizarFeedback(id: Int, feedbackRequestDTO: FeedbackRequestDTO): FeedbackResponseDTO? {
        val feedbackExistente = feedbackRepository.findById(id).orElse(null) ?: return null
        val feedbackAtualizado = feedbackExistente.copy(
            anotacoes = feedbackRequestDTO.anotacoes,
            nota = feedbackRequestDTO.nota,
            agendamento = null, // Fetch agendamento entity using agendamentoId
            usuario = null // Fetch usuario entity using usuarioId
        )
        val savedFeedback = feedbackRepository.save(feedbackAtualizado)
        return FeedbackResponseDTO(
            idFeedback = savedFeedback.idFeedback,
            anotacoes = savedFeedback.anotacoes,
            nota = savedFeedback.nota,
            agendamentoId = feedbackRequestDTO.agendamentoId,
            usuarioId = feedbackRequestDTO.usuarioId
        )
    }

    fun deletarFeedback(id: Int) {
        if (!feedbackRepository.existsById(id)) {
            throw IllegalArgumentException("Feedback não encontrado")
        }
        feedbackRepository.deleteById(id)
    }
}
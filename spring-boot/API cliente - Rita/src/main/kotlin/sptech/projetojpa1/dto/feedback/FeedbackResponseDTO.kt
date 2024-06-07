package sptech.projetojpa1.dto.feedback

data class FeedbackResponseDTO(
    val idFeedback: Int,
    val anotacoes: String?,
    val nota: Int?,
    val agendamentoId: Int,
    val usuarioId: Int
)
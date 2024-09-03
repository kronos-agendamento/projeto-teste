package sptech.projetojpa1.dto.feedback

import jakarta.validation.constraints.NotNull

data class FeedbackRequestDTO(
    val anotacoes: String?,
    @field:NotNull(message = "Nota é obrigatória")
    val nota: Int?,

    @field:NotNull(message = "Id do agendamento é obrigatório")
    val agendamentoId: Int,

    @field:NotNull(message = "Id do usuário é obrigatório")
    val usuario: Int,

    @field:NotNull(message = "Id do cliente avaliado é obrigatório")
    val clienteAvaliado: Int?
)
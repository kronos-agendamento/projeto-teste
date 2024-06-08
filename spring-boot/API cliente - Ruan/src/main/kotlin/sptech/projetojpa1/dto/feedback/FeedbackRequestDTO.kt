package sptech.projetojpa1.dto.feedback

import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotNull

data class FeedbackRequestDTO(
    val anotacoes: String?,
    @field:NotNull(message = "Nota é obrigatória") @field:Min(
        value = 1,
        message = "Nota deve ser maior que 0"
    ) val nota: Int?,
    @field:NotNull(message = "Id do agendamento é obrigatório") @field:Min(
        value = 1,
        message = "Id do agendamento deve ser maior que 0"
    ) val agendamentoId: Int,
    @field:NotNull(message = "Id do usuário é obrigatório") @field:Min(
        value = 1,
        message = "Id do usuário deve ser maior que 0"
    ) val usuarioId: Int
)
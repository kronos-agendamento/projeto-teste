package sptech.projetojpa1.dto.resposta

import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull

data class RespostaRequestDTO(
    @field:NotBlank val resposta: String,
    @field:NotNull(message = "Id da pergunta é obrigatório") @field:Min(
        value = 1,
        message = "Id da pergunta deve ser maior que 0"
    ) val perguntaId: Int,
    @field:NotNull(message = "Id da ficha é obrigatório") @field:Min(
        value = 1,
        message = "Id da ficha deve ser maior que 0"
    ) val fichaId: Int,
    @field:NotNull(message = "Id do usuário é obrigatório") @field:Min(
        value = 1,
        message = "Id do usuário deve ser maior que 0"
    ) val usuarioId: Int
)
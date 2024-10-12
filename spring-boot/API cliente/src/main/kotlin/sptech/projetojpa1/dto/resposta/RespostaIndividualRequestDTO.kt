package sptech.projetojpa1.dto.resposta

import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotBlank
import org.jetbrains.annotations.NotNull

data class RespostaIndividualRequestDTO(
    @field:NotBlank(message = "A resposta não pode estar em branco")
    val resposta: String,

    @field:Min(value = 1, message = "Id da pergunta deve ser maior que 0")
    val pergunta: Int
)
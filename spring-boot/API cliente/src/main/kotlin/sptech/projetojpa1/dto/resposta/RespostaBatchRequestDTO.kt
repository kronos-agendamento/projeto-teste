package sptech.projetojpa1.dto.resposta

import jakarta.validation.constraints.Min
import org.jetbrains.annotations.NotNull

data class RespostaBatchRequestDTO(
    @field:Min(value = 1, message = "Id da ficha deve ser maior que 0")
    val fichaAnamnese: Int,

    @field:Min(value = 1, message = "Id do usuário deve ser maior que 0")
    val usuario: Int,

    val respostas: List<RespostaIndividualRequestDTO>
)
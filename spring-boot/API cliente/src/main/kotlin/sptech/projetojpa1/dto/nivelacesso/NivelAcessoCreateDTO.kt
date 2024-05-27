package sptech.projetojpa1.dto.nivelacesso

import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull

data class NivelAcessoCreateDTO(
    @field:NotBlank(message = "Nome é obrigatório") val nome: String,
    @field:NotNull(message = "Nível é obrigatório") @field:Min(
        value = 1,
        message = "Nível deve ser maior que 0"
    ) val nivel: Int,
    @field:NotBlank(message = "Descrição é obrigatória") val descricao: String
)
package sptech.projetojpa1.dto.complemento

import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull

data class ComplementoRequestDTO(
    @field:NotBlank(message = "Complemento é obrigatório")
    val complemento: String,

    @field:NotNull(message = "Id do endereço não pode ser nulo")
    @field:Min(value = 1, message = "Id do endereço deve ser maior que 0")
    val enderecoId: Int
)
package sptech.projetojpa1.dto.complemento

import jakarta.validation.constraints.NotBlank

data class ComplementoUpdateDTO(
    @field:NotBlank(message = "Complemento é obrigatório")
    val complemento: String
)
package sptech.projetojpa1.dto.nivelacesso

import jakarta.validation.constraints.NotBlank

data class NivelAcessoUpdateDTO(
    @field:NotBlank(message = "Nome é obrigatório") val nome: String
)

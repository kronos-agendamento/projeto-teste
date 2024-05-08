package sptech.projetojpa1.dominio

import jakarta.validation.constraints.NotBlank

class PatchComplemento(
    // Novo complemento
    @field:NotBlank(message = "Novo complemento é obrigatório") val novoComplemento: String
)
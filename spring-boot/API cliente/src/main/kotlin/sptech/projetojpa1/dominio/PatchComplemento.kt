package sptech.projetojpa1.dominio

import jakarta.validation.constraints.NotBlank

class PatchComplemento (
    @field:NotBlank val novoComplemento:String
)
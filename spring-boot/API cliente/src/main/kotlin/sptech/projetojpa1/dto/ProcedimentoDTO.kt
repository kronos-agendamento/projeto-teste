package sptech.projetojpa1.dto

import jakarta.validation.constraints.NotBlank

data class ProcedimentoDTO(
    var id: Int? = null, // Identificador único do procedimento

    // Anotação para garantir que o tipo do procedimento não esteja em branco
    //@field:NotBlank(message = "O tipo do procedimento não pode estar em branco")
   // var tipo: String? = null,

    // Anotação para garantir que a descrição do procedimento não esteja em branco
    @field:NotBlank(message = "A descrição do procedimento não pode estar em branco")
    var descricao: String? = null
)

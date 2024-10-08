package sptech.projetojpa1.dto.procedimento

import jakarta.validation.constraints.NotBlank

data class ProcedimentoRequestDTO(
    @field:NotBlank(message = "Id do procedimento é obrigatório")
    val idProcedimento: Int?,

    @field:NotBlank(message = "Tipo é obrigatório")
    val tipo: String,

    @field:NotBlank(message = "Descrição é obrigatória")
    val descricao: String
)
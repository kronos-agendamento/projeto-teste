package sptech.projetojpa1.dto.procedimento

import jakarta.validation.constraints.NotBlank
import sptech.projetojpa1.dominio.Promocao

data class ProcedimentoRequestDTO(
    @field:NotBlank(message = "Tipo é obrigatório") val tipo: String,
    @field:NotBlank(message = "Descrição é obrigatória") val descricao: String,
    val promocao: Promocao
)

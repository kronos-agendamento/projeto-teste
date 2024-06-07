package sptech.projetojpa1.dto.promocao

import java.util.*

data class PromocaoResponseDTO(
    val id: Int,
    val tipoPromocao: String,
    val descricao: String,
    val dataInicio: Date,
    val dataFim: Date
)
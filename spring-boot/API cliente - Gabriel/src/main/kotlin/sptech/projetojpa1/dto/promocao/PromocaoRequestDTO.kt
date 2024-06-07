package sptech.projetojpa1.dto.promocao

import java.util.*

data class PromocaoRequestDTO(
    val tipoPromocao: String,
    val descricao: String,
    val dataInicio: Date,
    val dataFim: Date
)
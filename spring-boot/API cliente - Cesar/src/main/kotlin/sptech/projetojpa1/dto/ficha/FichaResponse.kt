package sptech.projetojpa1.dto

import java.time.LocalDateTime

data class FichaResponse(
    val codigoFicha: Int?,
    val dataPreenchimento: LocalDateTime
)

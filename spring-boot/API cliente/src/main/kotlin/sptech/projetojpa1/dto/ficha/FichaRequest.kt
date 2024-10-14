package sptech.projetojpa1.dto

import sptech.projetojpa1.domain.Usuario
import java.time.LocalDateTime

data class FichaRequest(
    val dataPreenchimento: LocalDateTime,
    val usuario: Usuario
)

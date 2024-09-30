package sptech.projetojpa1.dto.loginlogoff

import java.time.LocalDateTime

data class LoginLogoffRequest(
    val logi: String,
    val dataHorario: LocalDateTime,
    val fkUsuario: Int
)


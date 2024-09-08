package sptech.projetojpa1.dto.usuario

import java.time.LocalDate

data class UsuarioResponseDTO(
    var idUsuario: Int?,
    var nome: String?,
    var dataNasc: LocalDate?,
)

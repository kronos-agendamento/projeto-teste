package sptech.projetojpa1.dto.comentario

import sptech.projetojpa1.dominio.Usuario

data class ComentarioResponse(
    var id: Int?,
    var texto: String,
    var curtidas: Int,
    var usuario: Usuario
)
package sptech.projetojpa1.dto.publicacao

import sptech.projetojpa1.dominio.Usuario

data class PublicacaoResponse(
    var id: Int?,
    var titulo: String,
    var legenda: String?,
    var foto: String?,
    var curtidas: Int,
    var usuario: Usuario
)
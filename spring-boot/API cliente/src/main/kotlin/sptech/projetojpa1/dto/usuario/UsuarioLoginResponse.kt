package sptech.projetojpa1.dto.usuario

import sptech.projetojpa1.domain.Empresa
import sptech.projetojpa1.domain.Usuario


data class UsuarioLoginResponse(
    val mensagem: String,
    val nome: String,
    val email: String,
    var cpf: String,
    val instagram: String,
    val empresa: Empresa?,
    val idUsuario: Int?
)

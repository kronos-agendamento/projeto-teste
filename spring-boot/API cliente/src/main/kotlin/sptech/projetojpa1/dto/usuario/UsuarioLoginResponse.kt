package sptech.projetojpa1.dto.usuario

import sptech.projetojpa1.domain.Empresa


data class UsuarioLoginResponse(
    val mensagem: String,
    val nome: String,
    val email: String,
    var cpf: String,
    val instagram: String,
    val empresa: Empresa?
)

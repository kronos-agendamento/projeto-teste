package sptech.projetojpa1.dto.usuario

import java.time.LocalDate

data class UsuarioRequest(
    val codigo: Int?,
    val nome: String?,
    val email: String?,
    val senha: String?,
    val instagram: String?,
    var cpf: String?,
    val telefone: Long?,
    val dataNasc: LocalDate?,
    val genero: String?,
    val indicacao: String?,
    val status: Boolean?,
    val nivelAcessoId: Int?,
    val enderecoId: Int?,
    val empresaId: Int?,
    val fichaAnamneseId: Int?
)



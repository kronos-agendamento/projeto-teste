package sptech.projetojpa1.dto.usuario

import java.time.LocalDate

data class UsuarioRequest(
    var codigo: Int?,
    var nome: String,
    var email: String,
    var senha: String?,
    var instagram: String,
    var cpf: String,
    var telefone: Long,
    var telefoneEmergencial: Long,
    var dataNasc: LocalDate,
    var genero: String,
    var indicacao: String?,
    var status: Boolean,
    var nivelAcessoId: Int?,
    var enderecoId: Int?,
    var empresaId: Int?,
    var fichaAnamneseId: Int?
)

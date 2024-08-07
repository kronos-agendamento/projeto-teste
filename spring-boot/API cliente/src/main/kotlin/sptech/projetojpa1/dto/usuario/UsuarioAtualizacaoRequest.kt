package sptech.projetojpa1.dto.usuario

import java.time.LocalDate

data class UsuarioAtualizacaoRequest(
    var nome: String?,
    var email: String?,
    var senha: String?,
    var instagram: String?,
    var dataNasc: LocalDate?,
    var telefone: Long?,
    var telefoneEmergencial: Long?,
    var genero: String?,
    var indicacao: String?,
    var nivelAcessoId: Int?,
    var enderecoId: Int?,
    var empresaId: Int?,
    var fichaAnamneseId: Int?
)

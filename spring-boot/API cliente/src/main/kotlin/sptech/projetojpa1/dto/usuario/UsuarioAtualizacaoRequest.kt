package sptech.projetojpa1.dto.usuario

import sptech.projetojpa1.domain.Endereco
import java.time.LocalDate

data class UsuarioAtualizacaoRequest(
    var nome: String?,
    var email: String?,
    var instagram: String?,
    var dataNasc: LocalDate?,
    var telefone: Long?,
    var genero: String?,
    var indicacao: String?,
    var avaliacao: Int?,
    var senha: String?,
    var endereco: Endereco?,
    var nivelAcesso: Int?
)
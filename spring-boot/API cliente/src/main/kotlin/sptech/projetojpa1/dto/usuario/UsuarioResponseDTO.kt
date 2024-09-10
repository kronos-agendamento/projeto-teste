package sptech.projetojpa1.dto.usuario

import sptech.projetojpa1.domain.Endereco
import java.time.LocalDate

data class UsuarioResponseDTO(
    var idUsuario: Int?,
    var nome: String?,
    var dataNasc: LocalDate? = null,
    var instagram: String? = null,
    var telefone: Long? = null,
    var cpf: String? = null,
    var status: Boolean? = null,
    var email: String? = null,
    var genero: String? = null,
    var indicacao: String? = null,
    var endereco: Endereco? = null,
)

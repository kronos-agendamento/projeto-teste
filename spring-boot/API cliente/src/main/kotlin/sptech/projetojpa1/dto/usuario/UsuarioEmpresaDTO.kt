package sptech.projetojpa1.dto.usuario

data class UsuarioEmpresaDTO(
    val codigo: Int?,
    val nome: String?,
    val nivelAcesso: Int?,
    val endereco: Int? = null
)

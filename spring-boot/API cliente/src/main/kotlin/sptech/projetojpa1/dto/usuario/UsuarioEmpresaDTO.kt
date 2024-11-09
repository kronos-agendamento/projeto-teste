package sptech.projetojpa1.dto.usuario

data class UsuarioEmpresaDTO(
    val codigo: Int?,
    val nome: String?,
    val foto: ByteArray?,
    val nivelAcesso: Int?,
    val endereco: Int? = null
)

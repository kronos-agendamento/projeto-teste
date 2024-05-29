package sptech.projetojpa1.dto.nivelacesso

data class NivelAcessoResponseDTO(
    val codigo: Int?,
    val nome: String,
    val nivel: Int,
    val descricao: String
)

package sptech.projetojpa1.dto.resposta

data class RespostaResponseDTO(
    val id: Int,
    val resposta: String,
    val perguntaDescricao: String,
    val perguntaTipo: String,
    val usuarioNome: String,
    val usuarioCpf: String,
    val fichaDataPreenchimento: String
)
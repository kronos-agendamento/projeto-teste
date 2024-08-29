package sptech.projetojpa1.dto.resposta

data class RespostaResponseDTO(
    val idResposta: Int?,
    val resposta: String,
    val pergunta: String,
    val usuario: String,
    val dataPreenchimento: String
)
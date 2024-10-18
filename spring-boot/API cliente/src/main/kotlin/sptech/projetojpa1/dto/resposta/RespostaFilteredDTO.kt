package sptech.projetojpa1.dto.resposta

data class RespostaFilteredDTO(
    val resposta: String,
    val pergunta: String,
    val usuario: String,
    val dataPreenchimento: String,
)
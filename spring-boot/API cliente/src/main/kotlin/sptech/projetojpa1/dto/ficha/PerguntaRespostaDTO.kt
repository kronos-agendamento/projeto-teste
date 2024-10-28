package sptech.projetojpa1.dto.ficha

data class PerguntaRespostaDTO(
    val pergunta: String,
    val perguntaTipo: String? = null,
    val resposta: String
)
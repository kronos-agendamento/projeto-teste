package sptech.projetojpa1.dto.pergunta

data class PerguntaRequest(
    val codigoPergunta: Int,
    val descricao: String,
    val tipo: String,
    val status: Boolean
)

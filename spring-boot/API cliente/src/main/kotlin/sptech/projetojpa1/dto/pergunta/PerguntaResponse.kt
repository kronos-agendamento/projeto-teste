package sptech.projetojpa1.dto.pergunta

data class PerguntaResponse(
    val idPergunta: Int?,
    val pergunta: String,
    val ativa: Boolean,
    val tipo:String?
)
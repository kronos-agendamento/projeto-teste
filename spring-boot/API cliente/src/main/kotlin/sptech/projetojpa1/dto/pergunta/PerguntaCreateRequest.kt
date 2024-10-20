package sptech.projetojpa1.dto.pergunta

data class PerguntaCreateRequest(
    val pergunta: String,
    val ativa: Boolean? = null,
    val tipo:String?
)
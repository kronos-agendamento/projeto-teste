package sptech.projetojpa1.dto.pergunta

data class PerguntaUpdateRequest(
    val pergunta: String,
    val ativa: Boolean?,
    val tipo: String?
)
package sptech.projetojpa1.dto.resposta

data class RespostaPersonalidade (
    val usuarioId: Int,
    val respostas: List<RespostaDTO>
)

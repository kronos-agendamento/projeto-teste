package sptech.projetojpa1.dto.resposta

data class RespostaFilteredDTO(
    val resposta: String,
    val descricaoPergunta: String? = null,
    val tipoPergunta: String? = null,
    val nomeUsuario: String,
    val cpfUsuario: String,
    val dataPreenchimentoFicha: String
)
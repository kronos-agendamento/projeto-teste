package sptech.projetojpa1.dto.ficha

class FichaAnamneseResponseDTO {
    var idFichaAnamnese: Int? = null
    var dataPreenchimento: String? = null
    var usuarioId: Int? = null
    var usuarioNome: String? = null
    var usuarioCpf: String? = null
    var perguntasRespostas: List<PerguntaRespostaDTO>? = null
}
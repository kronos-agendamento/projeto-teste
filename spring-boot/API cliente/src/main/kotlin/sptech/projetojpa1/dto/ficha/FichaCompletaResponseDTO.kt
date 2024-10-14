package sptech.projetojpa1.dto

import sptech.projetojpa1.dto.ficha.PerguntaRespostaDTO
import java.time.LocalDateTime

data class FichaCompletaResponseDTO(
    val codigoFicha: Int?,
    val dataPreenchimento: LocalDateTime,
    val usuarioId: Int?,
    val usuarioNome: String?,
    val perguntasRespostas: List<PerguntaRespostaDTO>
)

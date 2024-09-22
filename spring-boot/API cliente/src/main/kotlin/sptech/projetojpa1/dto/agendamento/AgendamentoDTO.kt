package sptech.projetojpa1.dto.agendamento

import java.time.LocalDateTime

data class AgendamentoDTO (
    val nomeUsuario: String,
    val usuarioId: Int,
    val dataAgendamento: LocalDateTime,
    val tipoAgendamento: String,
    val tipoProcedimento: String,
    val especificacaoProcedimento: String
){}
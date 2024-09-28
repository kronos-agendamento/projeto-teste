package sptech.projetojpa1.dto.agendamento

import sptech.projetojpa1.domain.Especificacao
import java.time.LocalDateTime

data class AgendamentoDTO (
    val nomeUsuario: String,
    val idAgendamento: Int,
    val usuarioId: Int,
    val dataAgendamento: LocalDateTime,
    val tipoAgendamento: String,
    val tipoProcedimento: String,
    val especificacaoProcedimento: String,
    val fkEspecificacao: Int,
    val fkProcedimento: Int
){}
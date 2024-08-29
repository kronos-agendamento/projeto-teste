package sptech.projetojpa1.dto.agendamento

import sptech.projetojpa1.domain.Especificacao
import sptech.projetojpa1.domain.Procedimento
import sptech.projetojpa1.domain.Status
import sptech.projetojpa1.domain.Usuario
import java.time.LocalDateTime

data class AgendamentoResponseDTO(
    var idAgendamento: Int?,
    var dataHorario: LocalDateTime?,
    var tipoAgendamento: String?,
    var usuario: Usuario,
    var procedimento: Procedimento,
    var especificacao: Especificacao,
    var statusAgendamento: Status
)

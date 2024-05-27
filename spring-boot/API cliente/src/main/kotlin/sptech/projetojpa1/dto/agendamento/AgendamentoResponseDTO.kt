package sptech.projetojpa1.dto.agendamento

import sptech.projetojpa1.dominio.Procedimento
import sptech.projetojpa1.dominio.Status
import sptech.projetojpa1.dominio.Usuario
import java.util.*

data class AgendamentoResponseDTO(
    var idAgendamento: Int,
    var data: Date?,
    var horario: Date?,
    var tipoAgendamento: Int?,
    var usuario: Usuario,
    var procedimento: Procedimento,
    var statusAgendamento: Status
)
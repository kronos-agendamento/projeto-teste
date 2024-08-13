package sptech.projetojpa1.dto.agendamento

import sptech.projetojpa1.dominio.Especificacao
import sptech.projetojpa1.dominio.Procedimento
import sptech.projetojpa1.dominio.Status
import sptech.projetojpa1.dominio.Usuario
import java.util.*

data class AgendamentoResponseDTO(
    var idAgendamento: Int?,
    var dataHorario: Date?,
    var tipoAgendamento: String?,
    var usuario: Usuario,
    var procedimento: Procedimento,
    var especificacao: Especificacao,  // Novo campo
    var statusAgendamento: Status
)

package sptech.projetojpa1.dto.agendamento

import sptech.projetojpa1.domain.Status
import java.time.LocalDateTime

data class AgendamentoResponseDTO(
    var idAgendamento: Int? = null,
    var dataHorario: LocalDateTime? = null,
    var tipoAgendamento: String? = null,
    var usuario: String? = null,
    var email: String? = null,
    var tempoAgendar: Int? = null,
    var homecare: Boolean? = null,
    var usuarioTelefone: String? = null,
    var usuarioCpf: String? = null,
    var usuarioId: Int? = null,
    var procedimento: String? = null,
    var especificacao: String? = null,
    var fkEspecificacao: Int? = null,
    var fkProcedimento: Int? = null,
    var statusAgendamento: Status? = null
)

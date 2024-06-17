package sptech.projetojpa1.dto.agendamento

import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotNull
import java.sql.Timestamp
import java.util.*

data class AgendamentoRequestDTO(
    @field:NotNull(message = "Data não pode ser nula")
    var data: Date?,

    @field:NotNull(message = "Horário não pode ser nulo")
    var horario: Timestamp?,

    @field:NotNull(message = "Tipo de agendamento não pode ser nulo")
    var tipoAgendamento: Int?,

    @field:NotNull(message = "Id do usuário não pode ser nulo")
    @field:Min(value = 1, message = "Id do usuário deve ser maior que 0")
    var fk_usuario: Int,

    @field:NotNull(message = "Id do procedimento não pode ser nulo")
    @field:Min(value = 1, message = "Id do procedimento deve ser maior que 0")
    var fk_procedimento: Int,

    @field:NotNull(message = "Id do status não pode ser nulo")
    @field:Min(value = 1, message = "Id do status deve ser maior que 0")
    var fk_status: Int
)
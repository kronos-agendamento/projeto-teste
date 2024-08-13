package sptech.projetojpa1.dto.horario

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Pattern

data class HorarioFuncionamentoRequest(
  val id: Int,
  @field:NotBlank val diaInicio: String,
  @field:NotBlank val diaFim: String,
  @field:Pattern(regexp = "^([0-1]\\d|2[0-3]):([0-5]\\d)$", message = "O horário deve estar no formato HH:MM")
  @field:NotBlank val horarioAbertura: String,
  @field:Pattern(regexp = "^([0-1]\\d|2[0-3]):([0-5]\\d)$", message = "O horário deve estar no formato HH:MM")
  @field:NotBlank val horarioFechamento: String
)

package sptech.projetojpa1.dto.horario

data class HorarioFuncionamentoRequest(
  val id: Int,
  val diaSemana: String,
  val horarioAbertura: String,
  val horarioFechamento: String
)

package sptech.projetojpa1.dto.horario

import jakarta.validation.constraints.NotBlank

data class HorarioFuncionamentoAttRequest(
    @field:NotBlank val horario: String
)

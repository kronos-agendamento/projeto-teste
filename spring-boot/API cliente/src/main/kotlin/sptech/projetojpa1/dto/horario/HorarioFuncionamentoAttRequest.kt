package sptech.projetojpa1.dto.horario

    import jakarta.validation.constraints.NotBlank
    import jakarta.validation.constraints.Pattern

data class HorarioFuncionamentoAttRequest(
    @field:Pattern(regexp = "^([0-1]\\d|2[0-3]):([0-5]\\d)$", message = "O horário deve estar no formato HH:MM")
    @field:NotBlank val horario: String
)
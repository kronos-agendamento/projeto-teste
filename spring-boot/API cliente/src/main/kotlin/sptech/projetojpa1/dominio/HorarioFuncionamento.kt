package sptech.projetojpa1.dominio

import jakarta.persistence.*
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Pattern
import java.sql.Time
import java.time.LocalTime

@Entity
@Table(name = "horarioFuncionamento")
class HorarioFuncionamento(
    // Código do horário de funcionamento
    @field:Id @field:GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_horario_funcionamento")
    var codigo: Int,
    // Dia da semana
    var diaSemana: String,
    // Horário de abertura
    @field:Pattern(regexp = "^([0-1]\\d|2[0-3]):([0-5]\\d)$", message = "O tempo de colocação deve estar no formato HH:MM")
    @field:NotBlank(message = "O horário de abertura é obrigatório")
    var horarioAbertura: String,
    // Horário de fechamento
    @field:Pattern(regexp = "^([0-1]\\d|2[0-3]):([0-5]\\d)$", message = "O tempo de colocação deve estar no formato HH:MM")
    @field:NotBlank(message = "O horário de fechamento é obrigatório")
    var horarioFechamento: String
)
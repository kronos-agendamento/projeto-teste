package sptech.projetojpa1.domain

import jakarta.persistence.*
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Pattern

@Entity
@Table(name = "horarioFuncionamento")
class HorarioFuncionamento(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_horario_funcionamento") // Atualize para o nome correto
    var id: Int? = null,

    @NotBlank(message = "O dia de início é obrigatório")
    @Column(name = "dia_inicio")
    var diaInicio: String,

    @NotBlank(message = "O dia de fim é obrigatório")
    @Column(name = "dia_fim")
    var diaFim: String,

    @Pattern(regexp = "^([0-1]\\d|2[0-3]):([0-5]\\d)$", message = "O horário de abertura deve estar no formato HH:MM")
    @NotBlank(message = "O horário de abertura é obrigatório")
    @Column(name = "horario_abertura")
    var horarioAbertura: String,

    @Pattern(regexp = "^([0-1]\\d|2[0-3]):([0-5]\\d)$", message = "O horário de fechamento deve estar no formato HH:MM")
    @NotBlank(message = "O horário de fechamento é obrigatório")
    @Column(name = "horario_fechamento")
    var horarioFechamento: String
) {
    override fun toString(): String {
        return "HorarioFuncionamento(id=$id, diaInicio='$diaInicio', diaFim='$diaFim', horarioAbertura='$horarioAbertura', horarioFechamento='$horarioFechamento')"
    }
}

package sptech.projetojpa1.domain

import jakarta.persistence.*
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotNull
import java.time.LocalDateTime

@Entity
@Table(name = "agendamento")
class Agendamento(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_agendamento")
    var idAgendamento: Int = 0,

    @field:NotNull(message = "Data e horário não podem ser nulos")
    @Column(name = "data_horario")
    var dataHorario: LocalDateTime?,

    @field:NotNull(message = "Tipo de agendamento não pode ser nulo")
    @Column(name = "tipo_agendamento")
    var tipoAgendamento: String?,

    @field:NotNull(message = "Usuário não pode ser nulo")
    @ManyToOne
    @JoinColumn(name = "fk_usuario")
    var usuario: Usuario,

    @field:NotNull(message = "Procedimento não pode ser nulo")
    @ManyToOne
    @JoinColumn(name = "fk_procedimento")
    var procedimento: Procedimento,

    @field:NotNull(message = "O tempo não pode ser nulo")
    @Column(name = "tempo_para_agendar")
    var tempoAgendar: Int?,

    @field:NotNull(message = "Especificação não pode ser nula")
    @ManyToOne
    @JoinColumn(name = "fk_especificacao_procedimento")
    var especificacao: Especificacao,

    @field:NotNull(message = "Status do agendamento não pode ser nulo")
    @ManyToOne
    @JoinColumn(name = "fk_status")
    var statusAgendamento: Status
)

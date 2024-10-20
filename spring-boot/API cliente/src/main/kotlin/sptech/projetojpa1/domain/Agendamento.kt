package sptech.projetojpa1.domain

import jakarta.persistence.*
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

    @ManyToOne
    @JoinColumn(name = "fk_procedimento")
    var procedimento: Procedimento? = null,

    @Column(name = "tempo_para_agendar")
    var tempoAgendar: Int? = null,

    @ManyToOne
    @JoinColumn(name = "fk_especificacao_procedimento")
    var especificacao: Especificacao? = null,

    @field:NotNull(message = "Status do agendamento não pode ser nulo")
    @ManyToOne
    @JoinColumn(name = "fk_status")
    var statusAgendamento: Status
)

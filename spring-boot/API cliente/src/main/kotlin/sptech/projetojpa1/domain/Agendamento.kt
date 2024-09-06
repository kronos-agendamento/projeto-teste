package sptech.projetojpa1.domain

import jakarta.persistence.*
import jakarta.validation.constraints.NotNull
import java.time.LocalDateTime

@Entity
@Table(name = "agendamento")
open class Agendamento(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_agendamento")
    open var idAgendamento: Int = 0, // Mark this property as open

    @field:NotNull(message = "Data e horário não podem ser nulos")
    @Column(name = "data_horario")
    open var dataHorario: LocalDateTime?,

    @field:NotNull(message = "Tipo de agendamento não pode ser nulo")
    @Column(name = "tipo_agendamento")
    open var tipoAgendamento: String?,

    @field:NotNull(message = "Usuário não pode ser nulo")
    @ManyToOne
    @JoinColumn(name = "fk_usuario")
    open var usuario: Usuario,

    @field:NotNull(message = "Procedimento não pode ser nulo")
    @ManyToOne
    @JoinColumn(name = "fk_procedimento")
    open var procedimento: Procedimento,

    @field:NotNull(message = "Especificação não pode ser nula")
    @ManyToOne
    @JoinColumn(name = "fk_especificacao_procedimento")
    open var especificacao: Especificacao,

    @field:NotNull(message = "Status do agendamento não pode ser nulo")
    @ManyToOne
    @JoinColumn(name = "fk_status")
    open var statusAgendamento: Status,

    @OneToOne(mappedBy = "agendamento", cascade = [CascadeType.ALL], orphanRemoval = true)
    open var feedback: Feedback? = null
)

package sptech.projetojpa1.dominio

import jakarta.persistence.*
import jakarta.validation.constraints.NotNull
import java.sql.Timestamp
import java.time.LocalTime
import java.util.Date

@Entity
@Table(name = "agendamento")
data class Agendamento(

    @Id
    @Column(name = "id_agendamento")
    var idAgendamento: Int,

    @field:NotNull(message = "Data não pode ser nula")
    @Column(name = "data")
    var data: Date?,

    @field:NotNull(message = "Horário não pode ser nulo")
    @Column(name = "horario")
    var horario: Timestamp?,

    @field:NotNull(message = "Tipo de agendamento não pode ser nulo")
    @Column(name = "tipo_agendamento")
    var tipoAgendamento: Int?,

    @field:NotNull(message = "Usuário não pode ser nulo")
    @ManyToOne
    @JoinColumn(name= "fk_usuario")
    var usuario: Usuario,

    @field:NotNull(message = "Procedimento não pode ser nulo")
    @ManyToOne
    @JoinColumn(name= "fk_procedimento")
    var procedimento: Procedimento,

    @field:NotNull(message = "Status do agendamento não pode ser nulo")
    @ManyToOne
    @JoinColumn(name= "fk_status")
    var statusAgendamento: Status
)
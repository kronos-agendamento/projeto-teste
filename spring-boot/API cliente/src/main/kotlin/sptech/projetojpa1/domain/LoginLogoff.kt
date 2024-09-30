package sptech.projetojpa1.domain

import jakarta.persistence.*
import java.time.LocalDateTime
import jakarta.validation.constraints.NotNull


@Entity
@Table(name = "login_logoff")
class LoginLogoff (

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_log")
    var idLog: Int = 0,

    @field:NotNull(message = "Campo 'logi' não pode ser nulo")
    @Column(name = "logi", length = 5)
    var logi: String,

    @field:NotNull(message = "Data e horário não podem ser nulos")
    @Column(name = "data_horario")
    var dataHorario: LocalDateTime,

    @field:NotNull(message = "Usuário não pode ser nulo")
    @ManyToOne
    @JoinColumn(name = "fk_usuario", referencedColumnName = "id_usuario")
    var usuario: Usuario
)

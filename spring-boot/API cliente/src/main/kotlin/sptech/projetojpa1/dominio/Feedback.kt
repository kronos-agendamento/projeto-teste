package sptech.projetojpa1.dominio

import jakarta.persistence.*
import jakarta.validation.constraints.*

@Entity
@Table(name = "feedback")
data class Feedback(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val idFeedback: Int = 0,

    @field:Size(max = 500, message = "Anotações devem ter no máximo 500 caracteres")
    val anotacoes: String?,

    @field:Min(value = 1, message = "Nota deve ser no mínimo 1")
    @field:Max(value = 5, message = "Nota deve ser no máximo 5")
    val nota: Int?,

    @field:NotNull(message = "Agendamento não pode ser nulo")
    @ManyToOne
    @JoinColumn(name="fk_agendamento")
    val agendamento: Agendamento?,

    @field:NotNull(message = "Usuário não pode ser nulo")
    @ManyToOne
    @JoinColumn(name="fk_usuario")
    val usuario: Usuario?
)
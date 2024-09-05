package sptech.projetojpa1.domain

import jakarta.persistence.*
import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min
import sptech.projetojpa1.domain.usuario.Cliente

@Entity
@Table(name = "Feedback")
data class Feedback(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val idFeedback: Int = 0,

    val anotacoes: String?,

    @field:Min(value = 1, message = "Nota deve ser no mínimo 1")
    @field:Max(value = 5, message = "Nota deve ser no máximo 5")
    val nota: Int?,

    @ManyToOne
    @JoinColumn(name = "fk_usuario")
    val usuario: Usuario?,

    @OneToOne
    @JoinColumn(name = "fk_agendamento", unique = true)
    val agendamento: Agendamento? = null,

    @ManyToOne
    @JoinColumn(name = "fk_cliente_avaliado")
    val clienteAvaliado: Usuario? = null
) {
    override fun toString(): String {
        return "Feedback(idFeedback=$idFeedback, anotacoes=$anotacoes, nota=$nota, usuario=$usuario, agendamento=$agendamento, clienteAvaliado=$clienteAvaliado)"
    }
}

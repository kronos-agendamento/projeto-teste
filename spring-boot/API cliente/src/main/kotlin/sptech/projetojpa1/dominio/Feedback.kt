package sptech.projetojpa1.dominio

import jakarta.persistence.*
import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min

@Entity
@Table(name = "feedback")
data class Feedback(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val idFeedback: Int = 0,

    val anotacoes: String?,

    @field:Min(value = 1, message = "Nota deve ser no mínimo 1")
    @field:Max(value = 5, message = "Nota deve ser no máximo 5")
    val nota: Int?,

    @ManyToOne
    @JoinColumn(name = "fk_agendamento")
    val agendamento: Agendamento?,

    @ManyToOne
    @JoinColumn(name = "fk_usuario")
    val usuario: Usuario?,

    @ManyToOne
    @JoinColumn(name = "fk_avaliador")
    val avaliador: Usuario?,

    @ManyToOne
    @JoinColumn(name = "fk_servico")
    val servico: Servico?,

    @ManyToOne
    @JoinColumn(name = "fk_cliente_avaliado")
    val clienteAvaliado: Cliente? = null
)

package sptech.projetojpa1.dominio

import jakarta.persistence.*
import java.util.*


@Entity
@Table(name = "promocao")
data class Promocao(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_promocao")
    val id: Int = 0,

    @Column(name = "tipo_promocao")
    val tipoPromocao: String,

    @Column(name = "descricao")
    val descricao: String,

    @Column(name = "datainicio")
    val dataInicio: Date,

    @Column(name = "datafim")
    val dataFim: Date
)

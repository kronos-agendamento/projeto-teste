package sptech.projetojpa1.dominio

import jakarta.persistence.*

@Entity
@Table(name = "servico")
open class Servico(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val idServico: Int = 0,

    val nome: String,

    val descricao: String,

    @OneToMany(mappedBy = "servico", cascade = [CascadeType.ALL], orphanRemoval = true)
    val feedbacks: MutableList<Feedback> = mutableListOf()

) {

    fun getAvaliacao(): Double? {
        return feedbacks.lastOrNull()?.nota?.toDouble()
    }

    fun getMediaAvaliacao(): Double? {
        return if (feedbacks.isNotEmpty()) {
            feedbacks.mapNotNull { it.nota?.toDouble() }.average()
        } else {
            null
        }
    }

    open fun descricaoCompleta(): String? {
        return descricao
    }
}

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

) : Avaliavel {

    override fun getAvaliacao(): Double? {
        return feedbacks.lastOrNull()?.nota?.toDouble()
    }

    override fun getMediaAvaliacao(): Double? {
        return if (feedbacks.isNotEmpty()) {
            feedbacks.mapNotNull { it.nota?.toDouble() }.average()
        } else {
            null
        }
    }

    override fun descricaoCompleta(): String? {
        return descricao
    }
}

@Entity
@Table(name = "cilios")
class Cilios(
    nome: String,
    descricao: String
) : Servico(nome = nome, descricao = descricao)

@Entity
@Table(name = "sobrancelha")
class Sobrancelha(
    nome: String,
    descricao: String
) : Servico(nome = nome, descricao = descricao)

@Entity
@Table(name = "make")
class Make(
    nome: String,
    descricao: String
) : Servico(nome = nome, descricao = descricao)

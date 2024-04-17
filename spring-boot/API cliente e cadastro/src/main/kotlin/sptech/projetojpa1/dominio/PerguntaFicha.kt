package sptech.projetojpa1.dominio

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.ManyToOne


@Entity
data class PerguntaFicha (
    @field:Id @field:GeneratedValue(strategy = GenerationType.IDENTITY)
    var codigoPerguntaFicha: Int,
    var status:Boolean = true,
    var nome:String,
    @field:ManyToOne var pergunta:Pergunta,
    @field:ManyToOne var resposta:Resposta,
) {
}
package sptech.projetojpa1.dominio

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.ManyToOne
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.type.SqlTypes

@Entity
class Pergunta (
    @field:Id @field:GeneratedValue(strategy = GenerationType.IDENTITY)
    var codigoPergunta: Int,
    var tipo:String,
    var nome:String,
    @field:ManyToOne
    val resposta:Resposta
) {
}
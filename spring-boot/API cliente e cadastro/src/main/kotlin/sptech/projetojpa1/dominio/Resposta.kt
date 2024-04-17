package sptech.projetojpa1.dominio

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id

@Entity
class Resposta (
    @field:Id @field:GeneratedValue(strategy = GenerationType.IDENTITY)
    var codigoResposta: Int,
    var tipo: String,
    var formatacao:String
) {
}
package sptech.projetojpa1.dominio

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.ManyToOne
import jakarta.validation.constraints.Future
import java.time.LocalDateTime

@Entity
class Ficha (
    @field:Id @field:GeneratedValue(strategy = GenerationType.IDENTITY)
    var codigoFicha:Int?,
    var nome:String,
    var status:Boolean = true,
    var dataCriacao:LocalDateTime
) {
}
package sptech.projetojpa1.dominio

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import java.time.LocalDateTime

@Entity
class FichaAnamnese (
    @field:Id @field:GeneratedValue(strategy = GenerationType.IDENTITY)
    var codigoFicha:Int?,
    var dataPreenchimento:LocalDateTime
) {
}
package sptech.projetojpa1.dominio

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

@Entity
class SituacaoGestante (
    @field:Id @field:GeneratedValue(strategy = GenerationType.IDENTITY)
    var codigo:Int?,
    @field:NotBlank @field:Size var nome:String?,
) {
}
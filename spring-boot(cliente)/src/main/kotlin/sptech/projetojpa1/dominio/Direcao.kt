package sptech.projetojpa1.dominio

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.validation.constraints.NotBlank

@Entity
class Direcao (
    @field:Id @field:GeneratedValue(strategy = GenerationType.IDENTITY)
    var codigo:Boolean?,
    @field:NotBlank var nome:String
) {
}
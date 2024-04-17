package sptech.projetojpa1.dominio

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.ManyToOne
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

@Entity
class ParteCorpo (
    @field:Id @field:GeneratedValue(strategy = GenerationType.IDENTITY)
    var codigo:Int?,
    @field:NotBlank var nome:String?,
    @field:ManyToOne @field:NotBlank var direcao: Direcao?,
    @field:ManyToOne @field:NotBlank var defeito: Defeito?,
    @field:ManyToOne @field:NotBlank var cores: Cores?

) {
}
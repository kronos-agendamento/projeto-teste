package sptech.projetojpa1.dominio

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size

@Entity
class NivelAcesso (
    @field:Id @field:GeneratedValue(strategy = GenerationType.IDENTITY) var codigo:Int?,
    @field:NotBlank var nome:String?,
    @field: NotNull var nivel:Int?,
    @field: NotBlank var descricao:String?
){

}
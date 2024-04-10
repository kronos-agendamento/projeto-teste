package sptech.projetojpa1.dominio

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.ManyToOne
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size

@Entity
data class Endereco(
    @field:Id @field:GeneratedValue(strategy = GenerationType.IDENTITY) var codigo:String,
    @field:NotBlank var logradouro:String,
    @field:NotNull @field:Size(max=8) var CEP:Double,
    @field:NotNull var numero: Int,
    @field:ManyToOne var complemento:String?,

)
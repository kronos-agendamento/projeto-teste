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
    @field:Id @field:GeneratedValue(strategy = GenerationType.IDENTITY) var codigo:Int,
    @field:NotBlank var logradouro:String,
    @field:NotNull @field:Size(max=8) var CEP:String,
    @field:NotNull var numero: Int,
    var bairro: String,
    var cidade: String,
    var estado: String,
    @field:ManyToOne var complemento:Complemento?

)
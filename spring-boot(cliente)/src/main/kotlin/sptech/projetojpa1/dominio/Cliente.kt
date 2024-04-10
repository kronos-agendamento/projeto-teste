package sptech.projetojpa1.dominio

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.ManyToOne
import jakarta.validation.constraints.*
import org.hibernate.validator.constraints.br.CPF
import java.time.LocalDate
@Entity
data class Cliente(
    @field:Id @field:GeneratedValue(strategy = GenerationType.IDENTITY) var codigo:Int?,
    @field:NotBlank var nome:String,
    @field:NotBlank @field:Email var email:String,
    @field:NotBlank var senha:String,
    @field:NotBlank var instagram:String,
    @field:NotNull @field:Size(max = 13) var celular:Double,
    @field:CPF var cpf:String,
    @field:Past var dataNascimento:LocalDate,
    @field:NotNull var genero:Boolean,
    var indicacao:String,
    @field:ManyToOne var nivelAcesso:NivelAcesso?,
    var status:Boolean=true
    )
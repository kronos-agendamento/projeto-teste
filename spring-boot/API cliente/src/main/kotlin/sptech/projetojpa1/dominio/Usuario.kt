package sptech.projetojpa1.dominio

import com.fasterxml.jackson.annotation.JsonIgnore
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.ManyToOne
import jakarta.validation.constraints.*
import org.hibernate.validator.constraints.br.CPF
import java.time.LocalDate
@Entity
data class Usuario(
    @field:Id @field:GeneratedValue(strategy = GenerationType.IDENTITY) var codigo:Int?,
    @field:NotBlank var nome:String?,
    @field:NotBlank @field:Email var email:String?,
    @field:NotBlank var senha:String?,
    @field:NotBlank var instagram:String?,
    @field:CPF var cpf:String?,
    @field:NotBlank @field:Size(max = 13)
    var telefone:Int,
    @field:NotBlank @field:Size(max = 13)
    var telefoneEmergencial:Int,
    @field:Past
    var dataNasc:LocalDate?,
    @field:NotNull
    var genero:String?,
    var indicacao:String?,
    @JsonIgnore @field:Column (length = 30*1024*1024)
    var foto:ByteArray?,
    var status:Boolean = true,
    @field:ManyToOne var nivelAcesso:NivelAcesso?,
    @field:ManyToOne var endereco: Endereco?,
    @field:ManyToOne var empresa: Empresa?,
    @field:ManyToOne var fichaAnamnese: FichaAnamnese?
    )


package sptech.projetojpa1.dominio

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.ManyToOne
import org.hibernate.validator.constraints.br.CNPJ
import java.time.LocalDateTime

@Entity
class Empresa (
    @field:Id @field:GeneratedValue(strategy = GenerationType.IDENTITY)
    var codigo:Int,
    var nome:String,
    var contato:LocalDateTime,
    @field:CNPJ var CNPJ:Int,
    @field:ManyToOne var endereco: Endereco,
    @field:ManyToOne var horarioFuncionamento: HorarioFuncionamento?
){
}
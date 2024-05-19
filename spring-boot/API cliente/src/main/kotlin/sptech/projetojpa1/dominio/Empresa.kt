package sptech.projetojpa1.dominio

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.ManyToOne
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size
import org.hibernate.validator.constraints.br.CNPJ
import java.time.LocalDateTime

@Entity
class Empresa(
    // Código da empresa
    @field:Id @field:GeneratedValue(strategy = GenerationType.IDENTITY) var codigo: Int,
    // Nome da empresa
    @field:NotBlank(message = "Nome é obrigatório") var nome: String,
    // Contato da empresa
    var contato: LocalDateTime,
    // CNPJ da empresa
    @field:CNPJ(message = "CNPJ inválido") var CNPJ: String,
    // Endereço da empresa
    @field:ManyToOne var endereco: Endereco,
    // Horário de funcionamento da empresa
    @field:ManyToOne var horarioFuncionamento: HorarioFuncionamento?
)
package sptech.projetojpa1.dominio

import jakarta.persistence.*
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import org.hibernate.validator.constraints.br.CNPJ
import java.time.LocalDateTime

@Entity
class Empresa(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    var codigo: Int,

    @field:NotBlank(message = "Nome é obrigatório")
    var nome: String,

    @field:NotNull(message = "Contato é obrigatório")
    var contato: LocalDateTime,

    @field:CNPJ(message = "CNPJ inválido")
    var CNPJ: String,

    @field:NotNull(message = "Endereço é obrigatório")
    @ManyToOne
    var endereco: Endereco,

    @field:NotNull(message = "Horário de Funcionamento é obrigatório")
    @ManyToOne
    var horarioFuncionamento: HorarioFuncionamento?
)
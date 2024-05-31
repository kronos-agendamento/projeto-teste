package sptech.projetojpa1.dominio

import jakarta.persistence.*
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size
import org.hibernate.validator.constraints.br.CNPJ
import java.time.LocalDateTime

@Entity
class Empresa(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_empresa")
    var codigo: Int,

    @field:NotBlank(message = "Nome é obrigatório")
    var nome: String,

    @field:NotNull(message = "Contato é obrigatório")
    @field:Size(max = 11)
    var contato: Char,

    @field:CNPJ(message = "CNPJ inválido")
    var CNPJ: String,

    @field:NotNull(message = "Endereço é obrigatório")
    @ManyToOne
    @JoinColumn(name = "endereco_id_endereco")
    var endereco: Endereco,

    @field:NotNull(message = "Horário de Funcionamento é obrigatório")
    @ManyToOne
    @JoinColumn(name = "fk_horario_funcionamento")
    var horarioFuncionamento: HorarioFuncionamento?
)
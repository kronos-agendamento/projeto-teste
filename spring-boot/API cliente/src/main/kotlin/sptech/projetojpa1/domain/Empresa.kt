package sptech.projetojpa1.domain

import jakarta.persistence.*
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size
import org.hibernate.validator.constraints.br.CNPJ

@Entity
@Table(name = "Empresa")
class Empresa(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_empresa")
    var idEmpresa: Int? = null,

    @field:NotBlank(message = "Nome é obrigatório")
    @Column(name = "nome")
    var nome: String,

    @field:NotNull(message = "Telefone é obrigatório")
    @field:Size(max = 11, message = "O telefone deve ter no máximo 11 dígitos")
    @Column(name = "telefone")
    var telefone: String,

    @field:CNPJ(message = "CNPJ inválido")
    @Column(name = "cnpj")
    var cnpj: String,

    @field:NotNull(message = "Endereço é obrigatório")
    @ManyToOne
    @JoinColumn(name = "fk_endereco")
    var endereco: Endereco,

    @field:NotNull(message = "Horário de Funcionamento é obrigatório")
    @ManyToOne
    @JoinColumn(name = "fk_horario_funcionamento")
    var horarioFuncionamento: HorarioFuncionamento
) {
    override fun toString(): String {
        return "Empresa(idEmpresa=$idEmpresa, nome='$nome', telefone='$telefone', cnpj='$cnpj', endereco=$endereco, horarioFuncionamento=$horarioFuncionamento)"
    }
}
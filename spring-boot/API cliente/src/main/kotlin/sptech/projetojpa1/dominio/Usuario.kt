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
    // Código do usuário
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) var codigo: Int?,
    // Nome do usuário
    @field:NotBlank(message = "Nome é obrigatório") var nome: String?,
    // Email do usuário
    @field:NotBlank(message = "Email é obrigatório") @field:Email(message = "Email deve ser válido") var email: String?,
    // Senha do usuário
    @field:NotBlank(message = "Senha é obrigatória") @field:Size(
        min = 6,
        message = "A senha deve conter pelo menos 6 caracteres"
    ) var senha: String?,
    // Instagram do usuário
    @field:NotBlank(message = "Instagram é obrigatório") var instagram: String?,
    // CPF do usuário
    @field:NotBlank(message = "CPF é obrigatório") @field:CPF(message = "CPF inválido") var cpf: String?,
    // Telefone do usuário
    @field:NotNull(message = "Telefone é obrigatório") var telefone: Long?,
    // Telefone de emergência do usuário
    @field:NotNull(message = "Telefone de emergência é obrigatório") var telefoneEmergencial: Long?,
    // Data de nascimento do usuário
    @field:Past(message = "Data de nascimento deve estar no passado") var dataNasc: LocalDate?,
    // Gênero do usuário
    @field:NotBlank(message = "Gênero é obrigatório") var genero: String?,
    // Indicação do usuário
    var indicacao: String?,
    // Foto do usuário
    @field:Column(length = 100 * 1024 * 1024) //name = "musica_foto")
    @JsonIgnore
    var foto:ByteArray?,
    // Status do usuário
    var status: Boolean = true,
    // Nível de acesso do usuário
    @ManyToOne var nivelAcesso: NivelAcesso?,
    // Endereço do usuário
    @ManyToOne var endereco: Endereco?,
    // Empresa do usuário
    @ManyToOne var empresa: Empresa?,
    // Ficha de anamnese do usuário
    @ManyToOne var fichaAnamnese: FichaAnamnese?,

)
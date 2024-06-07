package sptech.projetojpa1.dominio

import com.fasterxml.jackson.annotation.JsonIgnore
import jakarta.persistence.*
import jakarta.validation.constraints.*
import org.hibernate.validator.constraints.br.CPF
import java.time.LocalDate

@Entity
@Table(name = "usuario")
data class Usuario(
    // Código do usuário
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    var codigo: Int?,
    // Nome do usuário
    @field:NotBlank(message = "Nome é obrigatório")
//    @Column(name = "nome", length = 100)
    var nome: String?,
    // Email do usuário
    @field:NotBlank(message = "Email é obrigatório") @field:Email(message = "Email deve ser válido")
//    @Column(name = "email", length = 100)
    var email: String?,
    // Senha do usuário
    @field:NotBlank(message = "Senha é obrigatória") @field:Size(
        min = 6,
        message = "A senha deve conter pelo menos 6 caracteres"
    )
//    @Column(name = "senha", length = 10)
    var senha: String?,
    // Instagram do usuário
    @field:NotBlank(message = "Instagram é obrigatório")
//    @Column(name = "instagram", length = 50)
    var instagram: String?,
    // CPF do usuário
    @field:NotBlank(message = "CPF é obrigatório") @field:CPF(message = "CPF inválido")
//    @Column(name = "cpf", length = 11)
    var cpf: String?,
    // Telefone do usuário
    @field:NotNull(message = "Telefone é obrigatório")
//    @Column(name = "telefone", length = 11)
    var telefone: Long?,
    // Telefone de emergência do usuário
    @field:NotNull(message = "Telefone de emergência é obrigatório")
//    @Column(name = "telefone_emergencial", length = 11)
    var telefoneEmergencial: Long?,
    // Data de nascimento do usuário
    @field:Past(message = "Data de nascimento deve estar no passado")
//    @Column(name = "data_nasc")
    var dataNasc: LocalDate?,
    // Gênero do usuário
    @field:NotBlank(message = "Gênero é obrigatório")
    var genero: String?,
    // Indicação do usuário
    var indicacao: String?,
    // Foto do usuário
    @field:Column(length = 100 * 1024 * 1024) //name = "musica_foto")
    @JsonIgnore
    var foto: ByteArray?,
    // Status do usuário
    var status: Boolean = true,
    // Nível de acesso do usuário
    @ManyToOne
    @JoinColumn(name = "fk_nivel_acesso")
    var nivelAcesso: NivelAcesso?,
    // Endereço do usuário
    @ManyToOne
    @JoinColumn(name = "fk_endereco")
    var endereco: Endereco?,
    // Empresa do usuário
    @ManyToOne
    @JoinColumn(name = "fk_empresa")
    var empresa: Empresa?,
    // Ficha de anamnese do usuário
    @ManyToOne
    @JoinColumn(name = "fk_ficha_anamnese")
    var fichaAnamnese: FichaAnamnese?
)
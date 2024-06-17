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
    var codigo: Int? = null,
    // Nome do usuário
    @field:NotBlank(message = "Nome é obrigatório")
    var nome: String? = null,
    // Email do usuário
    @field:NotBlank(message = "Email é obrigatório") @field:Email(message = "Email deve ser válido")
    var email: String? = null,
    // Senha do usuário
    @field:NotBlank(message = "Senha é obrigatória") @field:Size(
        min = 6,
        message = "A senha deve conter pelo menos 6 caracteres"
    )
    var senha: String? = null,
    // Instagram do usuário
    @field:NotBlank(message = "Instagram é obrigatório")
    var instagram: String? = null,
    // CPF do usuário
    @field:NotBlank(message = "CPF é obrigatório") @field:CPF(message = "CPF inválido")
    var cpf: String? = null,
    // Telefone do usuário
    @field:NotNull(message = "Telefone é obrigatório")
    var telefone: Long? = null,
    // Telefone de emergência do usuário
    @field:NotNull(message = "Telefone de emergência é obrigatório")
    var telefoneEmergencial: Long? = null,
    // Data de nascimento do usuário
    @field:Past(message = "Data de nascimento deve estar no passado")
    var dataNasc: LocalDate? = null,
    // Gênero do usuário
    @field:NotBlank(message = "Gênero é obrigatório")
    var genero: String? = null,
    // Indicação do usuário
    var indicacao: String? = null,
    // Foto do usuário
    @field:Column(length = 100 * 1024 * 1024) //name = "musica_foto")
    @JsonIgnore
    var foto: ByteArray? = null,
    // Status do usuário
    var status: Boolean = true,
    // Nível de acesso do usuário
    @ManyToOne
    @JoinColumn(name = "fk_nivel_acesso")
    var nivelAcesso: NivelAcesso? = null,
    // Endereço do usuário
    @ManyToOne
    @JoinColumn(name = "fk_endereco")
    var endereco: Endereco? = null,
    // Empresa do usuário
    @ManyToOne
    @JoinColumn(name = "fk_empresa")
    var empresa: Empresa? = null,
    // Ficha de anamnese do usuário
    @ManyToOne
    @JoinColumn(name = "fk_ficha_anamnese")
    var fichaAnamnese: FichaAnamnese? = null
)

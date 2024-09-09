package sptech.projetojpa1.domain

import com.fasterxml.jackson.annotation.JsonManagedReference
import jakarta.persistence.*
import jakarta.validation.constraints.*
import org.hibernate.validator.constraints.br.CPF
import java.time.LocalDate

@Entity
@Table(name = "usuario")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "dtype")
abstract class Usuario(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    var codigo: Int? = null,

    @field:NotBlank(message = "Nome é obrigatório")
    var nome: String? = null,

    @field:NotBlank(message = "Email é obrigatório")
    @field:Email(message = "Email deve ser válido")
    var email: String? = null,

    @field:NotBlank(message = "Senha é obrigatória")
    @field:Size(min = 6, message = "A senha deve conter pelo menos 6 caracteres")
    var senha: String? = null,

    @field:NotBlank(message = "Instagram é obrigatório")
    var instagram: String? = null,

    @Column(name = "cpf")
    @field:NotBlank(message = "CPF é obrigatório")
    @field:CPF(message = "CPF inválido")
    var cpf: String? = null,

    @field:NotNull(message = "Telefone é obrigatório")
    var telefone: Long? = null,

    @field:Past(message = "Data de nascimento deve estar no passado")
    var dataNasc: LocalDate? = null,

    var genero: String? = null,

    var indicacao: String? = null,

    @field:Column(length = 100 * 1024 * 1024)
    var foto: ByteArray? = null,

    var status: Boolean?,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fk_nivel_acesso")
    @JsonManagedReference
    var nivelAcesso: NivelAcesso? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fk_endereco")
    @JsonManagedReference
    var endereco: Endereco? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fk_empresa")
    @JsonManagedReference
    var empresa: Empresa? = null,

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fk_ficha_anamnese")
    @JsonManagedReference
    var fichaAnamnese: FichaAnamnese? = null
)
package sptech.projetojpa1.domain

import jakarta.persistence.*
import jakarta.validation.constraints.*
import org.hibernate.validator.constraints.br.CPF
import java.time.LocalDate

@Entity
@Table(name = "usuario")
@Inheritance(strategy = InheritanceType.JOINED)
open class Usuario(  // Marque a classe como open
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    open var codigo: Int? = null,  // Marque a propriedade como open

    @field:NotBlank(message = "Nome é obrigatório")
    open var nome: String? = null,  // Marque a propriedade como open

    @field:NotBlank(message = "Email é obrigatório")
    @field:Email(message = "Email deve ser válido")
    open var email: String? = null,  // Marque a propriedade como open

    @field:NotBlank(message = "Senha é obrigatória")
    @field:Size(min = 6, message = "A senha deve conter pelo menos 6 caracteres")
    open var senha: String? = null,  // Marque a propriedade como open

    @field:NotBlank(message = "Instagram é obrigatório")
    open var instagram: String? = null,  // Marque a propriedade como open

    @field:NotBlank(message = "CPF é obrigatório")
    @field:CPF(message = "CPF inválido")
    open var cpf: String? = null,  // Marque a propriedade como open

    @field:NotNull(message = "Telefone é obrigatório")
    open var telefone: Long? = null,  // Marque a propriedade como open

    @field:Past(message = "Data de nascimento deve estar no passado")
    open var dataNasc: LocalDate? = null,  // Marque a propriedade como open

    open var genero: String? = null,  // Marque a propriedade como open

    open var indicacao: String? = null,  // Marque a propriedade como open

    @field:Column(length = 100 * 1024 * 1024)
    open var foto: ByteArray? = null,  // Marque a propriedade como open

    open var status: Boolean? = true,  // Marque a propriedade como open

    @ManyToOne
    @JoinColumn(name = "fk_nivel_acesso")
    open var nivelAcesso: NivelAcesso? = null,  // Marque a propriedade como open

    @ManyToOne
    @JoinColumn(name = "fk_endereco")
    open var endereco: Endereco? = null,  // Marque a propriedade como open

    @ManyToOne
    @JoinColumn(name = "fk_empresa")
    open var empresa: Empresa? = null,  // Marque a propriedade como open

    @OneToOne
    @JoinColumn(name = "fk_ficha_anamnese")
    open var fichaAnamnese: FichaAnamnese? = null  // Marque a propriedade como open
)

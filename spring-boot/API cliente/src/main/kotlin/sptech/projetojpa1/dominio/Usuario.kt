package sptech.projetojpa1.dominio

import jakarta.persistence.*
import jakarta.validation.constraints.*
import org.hibernate.validator.constraints.br.CPF
import java.time.LocalDate

@Entity
@Table(name = "usuario")
@Inheritance(strategy = InheritanceType.JOINED)
abstract class Usuario(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    var codigo: Int? = null,

    @field:NotBlank(message = "Nome é obrigatório")
    var nome: String? = null,

    @field:NotBlank(message = "Email é obrigatório") @field:Email(message = "Email deve ser válido")
    var email: String? = null,

    @field:NotBlank(message = "Senha é obrigatória") @field:Size(
        min = 6,
        message = "A senha deve conter pelo menos 6 caracteres"
    )
    var senha: String? = null,

    @field:NotBlank(message = "Instagram é obrigatório")
    var instagram: String? = null,

    @field:NotBlank(message = "CPF é obrigatório") @field:CPF(message = "CPF inválido")
    var cpf: String? = null,

    @field:NotNull(message = "Telefone é obrigatório")
    var telefone: Long? = null,

    @field:NotNull(message = "Telefone de emergência é obrigatório")
    var telefoneEmergencial: Long? = null,

    @field:Past(message = "Data de nascimento deve estar no passado")
    var dataNasc: LocalDate? = null,

    var genero: String? = null,

    var indicacao: String? = null,

    @field:Column(length = 100 * 1024 * 1024)
    var foto: ByteArray? = null,

    var status: Boolean = true,

    @ManyToOne
    @JoinColumn(name = "fk_nivel_acesso")
    var nivelAcesso: NivelAcesso? = null,

    @ManyToOne
    @JoinColumn(name = "fk_endereco")
    var endereco: Endereco? = null,

    @ManyToOne
    @JoinColumn(name = "fk_empresa")
    var empresa: Empresa? = null,

    @ManyToOne
    @JoinColumn(name = "fk_ficha_anamnese")
    var fichaAnamnese: FichaAnamnese? = null
)

@Entity
@Table(name = "cliente")
class Cliente(
    codigo: Int? = null,
    nome: String? = null,
    email: String? = null,
    senha: String? = null,
    instagram: String? = null,

    @Column(name = "experiencia_avaliada")
    var experienciaAvaliada: String? = null,

    @Column(name = "frequencia")
    var frequencia: Int? = null
) : Usuario(codigo, nome, email, instagram)

@Entity
@Table(name = "profissional")
class Profissional(
    codigo: Int? = null,
    nome: String? = null,
    email: String? = null,
    senha: String? = null,
    instagram: String? = null,

    @Column(name = "numero_avaliacoes")
    var numeroAvaliacoes: Int? = null,

    @Column(name = "media_nota")
    var mediaNota: Double? = null,

    @Column(name = "qualificacoes")
    var qualificacoes: String? = null,

    @Column(name = "especialidade")
    var especialidade: String? = null
) : Usuario(codigo, nome, email, instagram)

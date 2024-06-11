package sptech.projetojpa1.dominio

import jakarta.persistence.*
import jakarta.validation.constraints.*

@Entity
@Table(name = "educacao")
data class Educacao(

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val idEducacao: Int = 0,

    @field:NotBlank(message = "O nome é obrigatório")
    @field:Size(max = 70, message = "O nome do procedimento deve ter no máximo 70 caracteres")
    var nome: String?,

    @field:NotNull(message = "O campo descrição não pode ser nulo")
    @field:Size(min = 1, max = 500, message = "O campo descrição deve ter entre 1 e 500 caracteres")
    var descricao: String,

    @field:NotBlank(message = "O nível é obrigatório")
    @field:Size(max = 50, message = "O nível deve ter no máximo 50 caracteres")
    var nivel: String,

    @field:NotBlank(message = "A modalidade é obrigatório")
    @field:Size(max = 50, message = "A modalidade deve ter no máximo 50 caracteres")
    var modalidade: String?,

    @field:Pattern(regexp = "^([0-9]+):([0-5]\\d)$", message = "A carga horária deve estar no formato HH:MM")

    @field:NotBlank(message = "A carga horária é obrigatória")
    @Column(name = "carga_horaria")
    var cargaHoraria: String,

    @field:NotNull(message = "O preço da Educação é obrigatório") @field:PositiveOrZero(message = "Preço de Educação deve ser zero ou positivo")
    @Column(name = "preco_educacao")
    var precoEducacao: Double,

    @field:NotNull(message = "Status do Programa Educativo não pode ser nulo")
    @Column(name = "ativo")
    var ativo: Boolean = true
)
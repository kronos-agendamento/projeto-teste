package sptech.projetojpa1.domain

import com.fasterxml.jackson.annotation.JsonIgnore
import jakarta.persistence.*
import jakarta.validation.constraints.*

@Entity
@Table(name = "especificacao")
data class Especificacao(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_especificacao_procedimento")
    val idEspecificacaoProcedimento: Int? = null,

    @field:NotBlank(message = "Especificação é obrigatória")
    @field:Size(max = 70, message = "A especificação do procedimento deve ter no máximo 70 caracteres")
    var especificacao: String?,

    @field:NotNull(message = "Preço de colocação é obrigatório")
    @field:PositiveOrZero(message = "Preço de colocação deve ser zero ou positivo")
    @Column(name = "preco_colocacao")
    var precoColocacao: Double? = null,

    @field:NotNull(message = "Preço de manutenção é obrigatório")
    @field:PositiveOrZero(message = "Preço de manutenção deve ser zero ou positivo")
    @Column(name = "preco_manutencao")
    var precoManutencao: Double? = null,

    @field:NotNull(message = "Preço de retirada é obrigatório")
    @field:PositiveOrZero(message = "Preço de retirada deve ser zero ou positivo")
    @Column(name = "preco_retirada")
    var precoRetirada: Double? = null,

    @field:Pattern(
        regexp = "^([0-1]\\d|2[0-3]):([0-5]\\d)$",
        message = "O tempo de colocação deve estar no formato HH:MM"
    )
    @field:NotBlank(message = "O tempo de colocação é obrigatório")
    @Column(name = "tempo_colocacao")
    var tempoColocacao: String? = null,

    @field:Pattern(
        regexp = "^([0-1]\\d|2[0-3]):([0-5]\\d)$",
        message = "O tempo de manutenção deve estar no formato HH:MM"
    )
    @field:NotBlank(message = "O tempo de colocação é obrigatório")
    @Column(name = "tempo_manutencao")
    var tempoManutencao: String? = null,

    @field:Pattern(
        regexp = "^([0-1]\\d|2[0-3]):([0-5]\\d)$",
        message = "O tempo de retirada deve estar no formato HH:MM"
    )
    @field:NotBlank(message = "O tempo de colocação é obrigatório")
    @Column(name = "tempo_retirada")
    var tempoRetirada: String? = null,

    var homecare: Boolean,

    var colocacao: Boolean,

    var manutencao: Boolean,

    var retirada: Boolean,

    @field:Column(length = 100 * 1024 * 1024)
    @JsonIgnore
    var foto: ByteArray?,

    @ManyToOne @field:NotNull(message = "Procedimento é obrigatório")
    @JoinColumn(name = "fk_procedimento")
    var procedimento: Procedimento?

)
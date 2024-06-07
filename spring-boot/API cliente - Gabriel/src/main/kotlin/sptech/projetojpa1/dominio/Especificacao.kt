package sptech.projetojpa1.dominio

import com.fasterxml.jackson.annotation.JsonIgnore
import jakarta.persistence.*
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.PositiveOrZero
import jakarta.validation.constraints.Size

@Entity
@Table(name = "especificacaoProcedimento")
data class Especificacao(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_especificacao_procedimento")
    val idEspecificacaoProcedimento: Int? = null,

    @field:NotBlank(message = "Especificação é obrigatória")
    @field:Size(max = 70, message = "A especificação do procedimento deve ter no máximo 70 caracteres")
    var especificacao: String?,

    @field:NotNull(message = "Preço de colocação é obrigatório") @field:PositiveOrZero(message = "Preço de colocação deve ser zero ou positivo")
    @Column(name = "preco_colocacao")
    var precoColocacao: Double?,

    @field:NotNull(message = "Preço de manutenção é obrigatório") @field:PositiveOrZero(message = "Preço de manutenção deve ser zero ou positivo")
    @Column(name = "preco_manutencao")
    var precoManutencao: Double?,

    @field:NotNull(message = "Preço de retirada é obrigatório") @field:PositiveOrZero(message = "Preço de retirada deve ser zero ou positivo")
    @Column(name = "preco_retirada")
    var precoRetirada: Double?,

    @field:Column(length = 100 * 1024 * 1024) //name = "musica_foto")
    @JsonIgnore
    var foto: ByteArray?,

    @ManyToOne @field:NotNull(message = "Tempo de procedimento é obrigatório")
    @JoinColumn(name = "fk_tempo_procedimento")
    var fkTempoProcedimento: TempoProcedimento?,

    @ManyToOne @field:NotNull(message = "Procedimento é obrigatório")
    @JoinColumn(name = "fk_procedimento")
    var fkProcedimento: Procedimento?
)

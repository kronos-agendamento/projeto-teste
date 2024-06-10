package sptech.projetojpa1.dominio

import jakarta.persistence.*
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Pattern
import java.sql.Time

@Entity
@Table(name = "tempoProcedimento")
class TempoProcedimento(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tempo_procedimento")
    val idTempoProcedimento: Int,

    @field:Pattern(regexp = "^([0-1]\\d|2[0-3]):([0-5]\\d)$", message = "O tempo de colocação deve estar no formato HH:MM")
    @field:NotBlank(message = "O tempo de colocação é obrigatório")
    @Column(name = "tempo_colocacao")
    var tempoColocacao: String,

    @field:Pattern(regexp = "^([0-1]\\d|2[0-3]):([0-5]\\d)$", message = "O tempo de manutenção deve estar no formato HH:MM")
    @field:NotBlank(message = "O tempo de colocação é obrigatório")
    @Column(name = "tempo_manutencao")
    var tempoManutencao: String,

    @field:Pattern(regexp = "^([0-1]\\d|2[0-3]):([0-5]\\d)$", message = "O tempo de retirada deve estar no formato HH:MM")
    @field:NotBlank(message = "O tempo de colocação é obrigatório")
    @Column(name = "tempo_retirada")
    var tempoRetirada: String
)
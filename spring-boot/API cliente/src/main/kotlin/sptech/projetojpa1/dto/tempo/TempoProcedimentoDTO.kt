package sptech.projetojpa1.dto.tempo

import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.validation.constraints.Pattern

data class TempoProcedimentoDTO(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val idTempoProcedimento: Int,

    @field:Pattern(regexp = "^([0-1]\\d|2[0-3]):([0-5]\\d)$", message = "O tempo de colocação deve estar no formato HH:MM")
    var tempoColocacao: String,

    @field:Pattern(regexp = "^([0-1]\\d|2[0-3]):([0-5]\\d)$", message = "O tempo de manutenção deve estar no formato HH:MM")
    var tempoManutencao: String,

    @field:Pattern(regexp = "^([0-1]\\d|2[0-3]):([0-5]\\d)$", message = "O tempo de retirada deve estar no formato HH:MM")
    var tempoRetirada: String
)

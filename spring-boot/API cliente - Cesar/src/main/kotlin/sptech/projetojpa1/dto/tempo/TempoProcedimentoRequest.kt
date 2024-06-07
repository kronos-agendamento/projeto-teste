package sptech.projetojpa1.dto.tempo

import jakarta.validation.constraints.Pattern
import sptech.projetojpa1.dominio.Especificacao
import java.sql.Time

data class TempoProcedimentoRequest(
    @field:Pattern(regexp = "^([0-1]\\d|2[0-3]):([0-5]\\d)$", message = "O tempo de colocação deve estar no formato HH:MM")
    var tempoColocacao: String,

    @field:Pattern(regexp = "^([0-1]\\d|2[0-3]):([0-5]\\d)$", message = "O tempo de manutenção deve estar no formato HH:MM")
    var tempoManutencao: String,

    @field:Pattern(regexp = "^([0-1]\\d|2[0-3]):([0-5]\\d)$", message = "O tempo de retirada deve estar no formato HH:MM")
    var tempoRetirada: String
)
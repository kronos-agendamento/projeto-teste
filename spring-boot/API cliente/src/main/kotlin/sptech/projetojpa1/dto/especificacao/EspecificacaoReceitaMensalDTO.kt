package sptech.projetojpa1.dto.especificacao

import java.math.BigDecimal
import java.util.*

data class EspecificacaoReceitaMensalDTO (
    val mes: String, // ou Date, dependendo da necessidade
    val receitaTotal: Double
    )
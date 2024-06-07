package sptech.projetojpa1.dto.especificacao

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.PositiveOrZero
import jakarta.validation.constraints.Size
import sptech.projetojpa1.dominio.TempoProcedimento

data class EspecificacaoDTO(
    @field:NotBlank(message = "Especificação é obrigatória")
    @field:Size(max = 70, message = "A especificação do procedimento deve ter no máximo 70 caracteres")
    val especificacao: String? = null,

    @field:NotNull(message = "Preço de colocação é obrigatório")
    @field:PositiveOrZero(message = "Preço de colocação deve ser zero ou positivo")
    val precoColocacao: Double? = null,

    @field:NotNull(message = "Preço de manutenção é obrigatório")
    @field:PositiveOrZero(message = "Preço de manutenção deve ser zero ou positivo")
    val precoManutencao: Double? = null,

    @field:NotNull(message = "Preço de retirada é obrigatório")
    @field:PositiveOrZero(message = "Preço de retirada deve ser zero ou positivo")
    val precoRetirada: Double? = null,

    @field:NotNull(message = "Tempo de procedimento é obrigatório")
    val fkTempoProcedimentoId: Int? = null,

    @field:NotNull(message = "Procedimento é obrigatório")
    val fkProcedimentoId: Int? = null
)

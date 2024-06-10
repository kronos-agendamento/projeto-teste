package sptech.projetojpa1.dto.pacote

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.PositiveOrZero
import jakarta.validation.constraints.Size

//data class PacoteDTO(
//    val idPacote: Int? = null,
//    @field:NotBlank(message = "Nome do pacote é obrigatório")
//    @field:Size(max = 100, message = "O nome do pacote deve ter no máximo 100 caracteres")
//    val nome: String,
//    @field:PositiveOrZero(message = "O desconto deve ser positivo ou zero")
//    val descontoColocacao: Double = 0.0,
//    @field:PositiveOrZero(message = "O desconto deve ser positivo ou zero")
//    val descontoManutencao: Double = 0.0,
//    val especificacaoIds: List<Int> = emptyList()
//)

data class PacoteDTO(
    val nome: String,
    val itens: List<ItemDTO>,
    val descontoColocacao: Double,
    val descontoManutencao: Double,
    val valorTotalColocacao: Double,
    val valorTotalManutencao: Double,
    val valorTotal: Double
) {
    data class ItemDTO(
        val especificacaoId: Int,
        val especificacao: String,
        val quantidade: Int,
        val precoColocacao: Double,
        val precoManutencao: Double
    )

}
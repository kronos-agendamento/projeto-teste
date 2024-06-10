package sptech.projetojpa1.dto.pacote

data class PacoteRequestDTO(
    val nome: String,
    val itens: List<ItemDTO>,
    val descontoColocacao: Double,
    val descontoManutecao: Double
) {
    data class ItemDTO(
        val especificacaoId: Int,
        val quantidade: Int
    )
}
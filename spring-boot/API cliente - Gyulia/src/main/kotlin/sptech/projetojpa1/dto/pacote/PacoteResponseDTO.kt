package sptech.projetojpa1.dto.pacote

data class PacoteResponseDTO(
    val id: Int?,
    val nome: String,
    val itens: List<PacoteDTO.ItemDTO>,
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
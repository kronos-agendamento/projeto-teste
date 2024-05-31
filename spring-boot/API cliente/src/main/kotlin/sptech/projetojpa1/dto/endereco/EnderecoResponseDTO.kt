package sptech.projetojpa1.dto.endereco

data class EnderecoResponseDTO(
    val codigo: Int,
    val logradouro: String,
    val cep: String,
    val numero: Int,
    val bairro: String?,
    val cidade: String?,
    val estado: String?
//    val complementoId: Int?,
//    val usuarioId: Int?
)

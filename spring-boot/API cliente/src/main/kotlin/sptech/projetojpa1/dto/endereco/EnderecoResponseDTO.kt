package sptech.projetojpa1.dto.endereco

data class EnderecoResponseDTO(
    val idEndereco: Int?,
    val logradouro: String,
    val numero: String,
    val cep: String,
    val bairro: String,
    val cidade: String,
    val estado: String
)
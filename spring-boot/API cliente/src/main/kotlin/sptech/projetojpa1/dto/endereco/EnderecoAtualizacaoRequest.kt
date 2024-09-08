package sptech.projetojpa1.dto.endereco

data class EnderecoAtualizacaoRequest (
    val logradouro: String?,
    val cep: String?,
    val numero: Int?,
    val bairro: String?,
    val cidade: String?,
    val estado: String?,
    val complemento: String?
)
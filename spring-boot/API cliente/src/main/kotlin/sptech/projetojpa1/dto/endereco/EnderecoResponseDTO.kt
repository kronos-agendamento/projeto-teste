package sptech.projetojpa1.dto.endereco

data class EnderecoResponseDTO(
    var idEndereco: Int?,
    var logradouro: String? = null,
    var numero: String? = null,
    var cep: String? = null,
    var bairro: String? = null,
    var cidade: String? = null,
    var estado: String? = null,
    var complemento: String? = null
)
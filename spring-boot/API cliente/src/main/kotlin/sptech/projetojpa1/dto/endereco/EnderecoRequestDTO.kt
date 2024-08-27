package sptech.projetojpa1.dto.endereco

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size

data class EnderecoRequestDTO(
    @field:NotBlank(message = "Logradouro é obrigatório") val logradouro: String,
    @field:NotBlank(message = "CEP é obrigatório") @field:Size(
        max = 10,
        message = "CEP deve ter no máximo 10 caracteres"
    ) val cep: String,
    val bairro: String?,
    val cidade: String?,
    val estado: String?,
    val numero: Int?,
    val complemento: String?
)
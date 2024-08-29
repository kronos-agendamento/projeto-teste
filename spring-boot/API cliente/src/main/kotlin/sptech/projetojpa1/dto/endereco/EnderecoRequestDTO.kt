package sptech.projetojpa1.dto.endereco

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size

data class EnderecoRequestDTO(
    @field:NotBlank(message = "Logradouro é obrigatório")
    val logradouro: String,

    @field:NotBlank(message = "CEP é obrigatório")
    @field:Size(max = 8, message = "CEP deve ter no máximo 8 caracteres")
    val cep: String,

    @field:NotBlank(message = "Bairro é obrigatório")
    val bairro: String,

    @field:NotBlank(message = "Cidade é obrigatória")
    val cidade: String,

    @field:NotBlank(message = "Estado é obrigatório")
    val estado: String,

    @field:NotNull(message = "Número é obrigatório")
    val numero: Int,

    @field:Size(max = 100, message = "Complemento deve ter no máximo 100 caracteres")
    val complemento: String?
)
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
    @field:NotNull(message = "Número é obrigatório") val numero: Int,
    val bairro: String?,
    val cidade: String?,
    val estado: String?
//    val complementoId: Int?,
//    @field:NotNull(message = "Id do usuário é obrigatório") val usuarioId: Int?
)
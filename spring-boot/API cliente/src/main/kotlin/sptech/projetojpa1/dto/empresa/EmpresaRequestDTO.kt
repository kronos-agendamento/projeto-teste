package sptech.projetojpa1.dto.empresa

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import org.hibernate.validator.constraints.br.CNPJ
import java.time.LocalDateTime

data class EmpresaRequestDTO(
    @field:NotBlank(message = "Nome é obrigatório") val nome: String,
    @field:NotNull(message = "Contato é obrigatório") val contato: Char,
    @field:CNPJ(message = "CNPJ inválido") val CNPJ: String,
    @field:NotNull(message = "Id do endereço é obrigatório") val enderecoId: Int,
    val horarioFuncionamentoId: Int?
)
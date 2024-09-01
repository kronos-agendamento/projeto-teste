package sptech.projetojpa1.dto.empresa

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import org.hibernate.validator.constraints.br.CNPJ

data class EmpresaRequestDTO(
    @field:NotBlank(message = "Nome é obrigatório")
    val nome: String,

    @field:NotNull(message = "Telefone é obrigatório")
    val telefone: String,

    @field:CNPJ(message = "CNPJ inválido")
    val cnpj: String,

    @field:NotNull(message = "Id do endereço é obrigatório")
    val enderecoId: Int,

    @field:NotNull(message = "Id do horario de funcionamento é obrigatório")
    val horarioFuncionamentoId: Int
)
package sptech.projetojpa1.dto.empresa

import jakarta.validation.constraints.NotBlank
import org.hibernate.validator.constraints.br.CNPJ
import java.time.LocalDateTime

data class EmpresaUpdateDTO(
    @field:NotBlank(message = "Nome é obrigatório") val nome: String?,
    val contato: String?,
    @field:CNPJ(message = "CNPJ inválido") val CNPJ: String?,
    val enderecoId: Int?,
    val horarioFuncionamentoId: Int?
)
package sptech.projetojpa1.dto.empresa

import sptech.projetojpa1.domain.Endereco
import sptech.projetojpa1.domain.HorarioFuncionamento

data class EmpresaUpdateDTO(
    val nome: String?,
    val telefone: String?,
    val cnpj: String?,
    val endereco: Endereco?,
    val horarioFuncionamento: HorarioFuncionamento?
)
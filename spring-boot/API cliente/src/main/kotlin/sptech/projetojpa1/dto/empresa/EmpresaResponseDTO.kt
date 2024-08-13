package sptech.projetojpa1.dto.empresa

import sptech.projetojpa1.dominio.Endereco
import sptech.projetojpa1.dominio.HorarioFuncionamento

data class EmpresaResponseDTO(
    val codigo: Int,
    val nome: String,
    val contato: String,
    val CNPJ: String,
    val endereco: Endereco,
    val horarioFuncionamento: HorarioFuncionamento?
)


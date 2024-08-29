package sptech.projetojpa1.dto.empresa

data class EmpresaUpdateDTO(
    val nome: String?,
    val telefone: String?,
    val cnpj: String?,
    val idEndereco: Int?,
    val idHorarioFuncionamento: Int?
)
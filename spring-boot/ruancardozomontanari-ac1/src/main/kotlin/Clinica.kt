package org.example

class Clinica(
    val nome: String,
    val funcionarios: List<Funcionario>,
    val salarioBase: Double
) {
    fun adicionarFuncionario(funcionario: Funcionario) {
        funcionarios.add(funcionario)
    }

    fun removerFuncionario(funcionario: Funcionario) {
        funcionarios.remove(funcionario)
    }
}
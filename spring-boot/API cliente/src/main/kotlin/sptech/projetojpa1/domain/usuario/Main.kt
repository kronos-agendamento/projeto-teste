package sptech.projetojpa1.domain.usuario

import sptech.projetojpa1.domain.Feedback
import sptech.projetojpa1.domain.Procedimento
import java.time.LocalDate

fun main() {
    println("=== Bem-vindo ao Sistema de Avaliação de Serviços Estéticos da Kronos ===\n")

    // Instanciando Procedimentos
    val servicoCilios = Procedimento(
        idProcedimento = 1,
        tipo = "Extensão de Cílios",
        descricao = "Aplicação de extensão de cílios fio a fio."
    )

    val servicoSobrancelha = Procedimento(
        idProcedimento = 2,
        tipo = "Design de Sobrancelha",
        descricao = "Design de sobrancelha com henna."
    )

    val servicoMake = Procedimento(
        idProcedimento = 3,
        tipo = "Maquiagem",
        descricao = "Maquiagem profissional para eventos especiais."
    )

    // Criando Clientes
    val cliente1 = Cliente(
        codigo = 1,
        nome = "Fernando Brandão",
        email = "fernando.brandao@sptech.school",
        senha = "senha123",
        instagram = "@brandao",
        cpf = "123.456.789-00",
        telefone = 11999999999,
        dataNasc = LocalDate.of(1990, 5, 23),
        genero = "Masculino",
        indicacao = "Instagram",
        foto = null,
        status = true,
        nivelAcesso = null,
        endereco = null,
        empresa = null,
        fichaAnamnese = null
    )

    val cliente2 = Cliente(
        codigo = 2,
        nome = "Leonardo Marques",
        email = "leonardo.marques@sptech.school",
        senha = "senha456",
        instagram = "@leo_marques",
        cpf = "987.654.321-00",
        telefone = 11988888888,
        dataNasc = LocalDate.of(1988, 8, 14),
        genero = "Masculino",
        indicacao = "Facebook",
        foto = null,
        status = true,
        nivelAcesso = null,
        endereco = null,
        empresa = null,
        fichaAnamnese = null
    )

    val cliente3 = Cliente(
        codigo = 3,
        nome = "Gerson Santos",
        email = "gerson.santos@sptech.school",
        senha = "senha789",
        instagram = "@gerson_santos",
        cpf = "123.456.123-00",
        telefone = 11977777777,
        dataNasc = LocalDate.of(1985, 12, 5),
        genero = "Masculino",
        indicacao = "Google",
        foto = null,
        status = true,
        nivelAcesso = null,
        endereco = null,
        empresa = null,
        fichaAnamnese = null
    )

    println(
        ">> Clientes adicionados ao sistema:\n" +
                "- ${cliente1.nome}\n" +
                "- ${cliente2.nome}\n" +
                "- ${cliente3.nome}\n"
    )

    // Criando Feedbacks
    val feedback1 = Feedback(
        anotacoes = "Excelente serviço! Os cílios ficaram perfeitos.",
        nota = 5,
        usuario = cliente1,
        agendamento = null
    )

    val feedback2 = Feedback(
        anotacoes = "Muito bom! Atendimento rápido e eficaz.",
        nota = 4,
        usuario = cliente2,
        agendamento = null
    )

    val feedback3 = Feedback(
        anotacoes = "Satisfatório, mas pode melhorar o design.",
        nota = 3,
        usuario = cliente3,
        agendamento = null
    )

    val feedback4 = Feedback(
        anotacoes = "Maquiagem maravilhosa! Superou minhas expectativas.",
        nota = 5,
        usuario = cliente3,
        agendamento = null
    )

    println(">> Feedbacks adicionados para os serviços.\n")

    // Criando Profissional
    val profissional = Profissional(
        codigo = 1,
        nome = "Priscila Plenitude",
        email = "priscila@plenitude.com",
        senha = "senha321",
        instagram = "@priscila.plenitude",
        cpf = "123.654.987-00",
        telefone = 11966666666,
        dataNasc = LocalDate.of(1985, 3, 15),
        genero = "Feminino",
        indicacao = "LinkedIn",
        foto = null,
        status = true,
        nivelAcesso = null,
        endereco = null,
        empresa = null,
        especialidade = "Cílios, Sobrancelha e Maquiagem"
    )

    println(">> Profissional '${profissional.nome}' adicionado ao sistema.\n")

    // Profissional avaliando clientes
    val feedbackCliente1 = Feedback(
        anotacoes = "Cliente foi pontual e educado.",
        nota = 5,
        usuario = profissional,
        clienteAvaliado = cliente1
    )

    val feedbackCliente2 = Feedback(
        anotacoes = "Cliente teve uma ótima interação durante o atendimento.",
        nota = 4,
        usuario = profissional,
        clienteAvaliado = cliente2
    )

    val feedbackCliente3 = Feedback(
        anotacoes = "Cliente demonstrou boa disposição e colaboração.",
        nota = 4,
        usuario = profissional,
        clienteAvaliado = cliente3
    )

    println(">> Avaliações dos clientes realizadas pelo profissional '${profissional.nome}'.\n")

    // Simulando o armazenamento do feedback dado pelo profissional aos clientes
    val feedbacksClientes = listOf(feedbackCliente1, feedbackCliente2, feedbackCliente3)

    // Exibindo a avaliação dos clientes feita pelo profissional
    println("=== Avaliações de Clientes ===\n")
    feedbacksClientes.forEach { feedback ->
        println("Profissional: ${feedback.usuario?.nome}")
        println("Cliente Avaliado: ${feedback.clienteAvaliado?.nome}")
        println("Anotação: ${feedback.anotacoes}")
        println("Nota: ${feedback.nota}\n")
    }

    println("=== Fim do Relatório ===")
}

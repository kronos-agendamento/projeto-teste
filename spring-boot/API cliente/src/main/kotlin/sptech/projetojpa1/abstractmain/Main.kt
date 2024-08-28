package sptech.projetojpa1.abstractmain

import sptech.projetojpa1.dominio.*

fun main() {
    println("=== Bem-vindo ao Sistema de Avaliação de Serviços Estéticos da Kronos ===\n")
    println("Este sistema permite avaliar e gerenciar os serviços estéticos oferecidos, \ncomo Extensão de Cílios, Design de Sobrancelhas e Maquiagem. Vamos explorar as funcionalidades disponíveis!\n")

    // Instanciando serviços específicos com suas descrições
    val servicoCilios = Cilios(
        nome = "Extensão de Cílios",
        descricao = "Aplicação de extensão de cílios fio a fio."
    )

    val servicoSobrancelha = Sobrancelha(
        nome = "Design de Sobrancelha",
        descricao = "Design de sobrancelha com henna."
    )

    val servicoMake = Make(
        nome = "Maquiagem",
        descricao = "Maquiagem profissional para eventos especiais."
    )

    // Criando clientes que serão avaliados
    val cliente1 = Cliente(
        codigo = 1,
        nome = "Fernando Brandão",
        email = "fernando.brandao@sptech.school",
        instagram = "@brandao"
    )

    val cliente2 = Cliente(
        codigo = 2,
        nome = "Leonardo Marques",
        email = "leonardo.marques@sptech.school",
        instagram = "@leo_marques"
    )

    val cliente3 = Cliente(
        codigo = 3,
        nome = "Gerson Santos",
        email = "gerson.santos@sptech.school",
        instagram = "@gerson_santos"
    )

    println(
        ">> Clientes adicionados ao sistema:\n" +
                "- ${cliente1.nome}\n" +
                "- ${cliente2.nome}\n" +
                "- ${cliente3.nome}\n"
    )

    // Criando feedbacks que os clientes deixaram para os serviços
    val feedbacks = listOf(
        Feedback(
            anotacoes = "Excelente serviço! Os cílios ficaram perfeitos.",
            nota = 5,
            agendamento = null,
            usuario = null,
            avaliador = cliente1,
            servico = servicoCilios
        ),
        Feedback(
            anotacoes = "Muito bom! Atendimento rápido e eficaz.",
            nota = 4,
            agendamento = null,
            usuario = null,
            avaliador = cliente1,
            servico = servicoCilios
        ),
        Feedback(
            anotacoes = "Satisfatório, mas pode melhorar o design.",
            nota = 3,
            agendamento = null,
            usuario = null,
            avaliador = cliente2,
            servico = servicoSobrancelha
        ),
        Feedback(
            anotacoes = "Maquiagem maravilhosa! Superou minhas expectativas.",
            nota = 5,
            agendamento = null,
            usuario = null,
            avaliador = cliente3,
            servico = servicoMake
        )
    )

    println(">> Feedbacks adicionados para os serviços.\n")

    // Adicionando feedbacks aos respectivos serviços
    servicoCilios.feedbacks.addAll(feedbacks.filter { it.servico == servicoCilios })
    servicoSobrancelha.feedbacks.add(feedbacks.find { it.servico == servicoSobrancelha }!!)
    servicoMake.feedbacks.add(feedbacks.find { it.servico == servicoMake }!!)

    // Criando um Profissional, que também é um Avaliador no sistema
    val profissional = Profissional(
        codigo = 1,
        nome = "Priscila Plenitude",
        especialidade = "Cílios, Sobrancelha e Maquiagem",
    )

    println(">> Profissional '${profissional.nome}' adicionado ao sistema.\n")

    // Profissional avaliando clientes
    val feedbackCliente1 = Feedback(
        anotacoes = "Cliente foi pontual e educado.",
        nota = 5,
        agendamento = null,
        usuario = null,
        avaliador = profissional,
        clienteAvaliado = cliente1,
        servico = null
    )

    val feedbackCliente2 = Feedback(
        anotacoes = "Cliente teve uma ótima interação durante o atendimento.",
        nota = 4,
        agendamento = null,
        usuario = null,
        avaliador = profissional,
        clienteAvaliado = cliente2,
        servico = null
    )

    val feedbackCliente3 = Feedback(
        anotacoes = "Cliente demonstrou boa disposição e colaboração.",
        nota = 4,
        agendamento = null,
        usuario = null,
        avaliador = profissional,
        clienteAvaliado = cliente3,
        servico = null
    )

    println(">> Avaliações dos clientes realizadas pelo profissional '${profissional.nome}'.\n")

    // Simulando o armazenamento do feedback dado pelo profissional aos clientes
    val feedbacksClientes = listOf(feedbackCliente1, feedbackCliente2, feedbackCliente3)

    // Exibindo a avaliação dos clientes feita pelo profissional
    println("=== Avaliações de Clientes ===\n")
    feedbacksClientes.forEach { feedback ->
        println("Profissional: ${feedback.avaliador?.nome}")
        println("Cliente Avaliado: ${feedback.clienteAvaliado?.nome}")
        println("Anotação: ${feedback.anotacoes}")
        println("Nota: ${feedback.nota}\n")
    }

    // Exibindo as avaliações e médias de cada serviço
    println("=== Avaliações de Serviços ===\n")
    exibirAvaliacaoServico(servicoCilios)
    exibirAvaliacaoServico(servicoSobrancelha)
    exibirAvaliacaoServico(servicoMake)

    println("=== Resumo Geral ===")
    println("Os clientes avaliaram nossos serviços com base em suas experiências.")
    println("Estamos comprometidos em continuar oferecendo serviços de alta qualidade para garantir a satisfação de nossos clientes.\n")

    println("=== Fim do Relatório ===")
}

// Função auxiliar para exibir avaliações de serviços
fun exibirAvaliacaoServico(servico: Servico) {
    println("Serviço: ${servico.nome}")
    println("Descrição: ${servico.descricaoCompleta()}")
    println("Última Avaliação: ${servico.getAvaliacao()}")
    println("Média de Avaliações: ${servico.getMediaAvaliacao()}\n")
}

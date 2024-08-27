package sptech.projetojpa1

import sptech.projetojpa1.dominio.*

fun main() {
    println("=== Bem-vindo ao Sistema de Avaliação de Serviços Estéticos da Kronos ===\n")

    println("Este sistema permite avaliar e gerenciar os serviços estéticos oferecidos, como Extensão de Cílios, Design de Sobrancelhas e Maquiagem. Vamos explorar as funcionalidades disponíveis!\n")

    // Criando instâncias de serviços específicos
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

    // Criando um Avaliador (Cliente) para dar feedbacks
    val avaliador = Cliente(
        codigo = 1,
        nome = "João Silva",
        email = "joao.silva@example.com",
        instagram = "@joaosilva"
    )

    println(">> Cliente '${avaliador.nome}' adicionado ao sistema.\n")

    // Criando Feedbacks para os serviços
    val feedback1 = Feedback(
        anotacoes = "Excelente serviço! Os cílios ficaram perfeitos.",
        nota = 5,
        agendamento = null,  // Exemplo de agendamento
        usuario = null,      // Exemplo de usuário
        avaliador = avaliador,
        servico = servicoCilios
    )

    val feedback2 = Feedback(
        anotacoes = "Muito bom! Atendimento rápido e eficaz.",
        nota = 4,
        agendamento = null,
        usuario = null,
        avaliador = avaliador,
        servico = servicoCilios
    )

    val feedback3 = Feedback(
        anotacoes = "Satisfatório, mas pode melhorar o design.",
        nota = 3,
        agendamento = null,
        usuario = null,
        avaliador = avaliador,
        servico = servicoSobrancelha
    )

    val feedback4 = Feedback(
        anotacoes = "Maquiagem maravilhosa! Superou minhas expectativas.",
        nota = 5,
        agendamento = null,
        usuario = null,
        avaliador = avaliador,
        servico = servicoMake
    )

    println(">> Feedbacks adicionados para os serviços.\n")

    // Adicionando feedbacks aos serviços correspondentes
    servicoCilios.feedbacks.add(feedback1)
    servicoCilios.feedbacks.add(feedback2)
    servicoSobrancelha.feedbacks.add(feedback3)
    servicoMake.feedbacks.add(feedback4)

    // Exibindo as avaliações individuais e médias de cada serviço
    println("=== Avaliações de Serviços ===\n")

    println("Serviço: ${servicoCilios.nome}")
    println("Descrição: ${servicoCilios.descricaoCompleta()}")
    println("Última Avaliação: ${servicoCilios.getAvaliacao()}")
    println("Média de Avaliações: ${servicoCilios.getMediaAvaliacao()}\n")

    println("Serviço: ${servicoSobrancelha.nome}")
    println("Descrição: ${servicoSobrancelha.descricaoCompleta()}")
    println("Última Avaliação: ${servicoSobrancelha.getAvaliacao()}")
    println("Média de Avaliações: ${servicoSobrancelha.getMediaAvaliacao()}\n")

    println("Serviço: ${servicoMake.nome}")
    println("Descrição: ${servicoMake.descricaoCompleta()}")
    println("Última Avaliação: ${servicoMake.getAvaliacao()}")
    println("Média de Avaliações: ${servicoMake.getMediaAvaliacao()}\n")

    println("=== Resumo Geral ===")
    println("O cliente ${avaliador.nome} avaliou nossos serviços com base em suas experiências.")
    println("Estamos comprometidos em continuar oferecendo serviços de alta qualidade para garantir a satisfação de nossos clientes.\n")

    println("=== Fim do Relatório ===")
}

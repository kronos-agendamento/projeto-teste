package sptech.projetojpa1.abstractmain

import sptech.projetojpa1.dominio.*
import javax.swing.JOptionPane

fun main() {
    while (true) {
        val escolhaInicial = JOptionPane.showInputDialog(
            null, "Bem-vindo ao Sistema de Avaliação da Kronos!\n" +
                    "Você deseja entrar como:\n1. Cliente\n2. Profissional\n3. Sair"
        )?.toIntOrNull()

        when (escolhaInicial) {
            1 -> {
                val nomeCliente = JOptionPane.showInputDialog("Digite seu nome:")
                val emailCliente = JOptionPane.showInputDialog("Digite seu email:")
                val instagramCliente = JOptionPane.showInputDialog("Digite seu Instagram:")

                val cliente = Cliente(
                    codigo = (1..1000).random(),
                    nome = nomeCliente,
                    email = emailCliente,
                    instagram = instagramCliente
                )

                JOptionPane.showMessageDialog(
                    null, "Cliente ${cliente.nome} cadastrado com sucesso!"
                )

                // Aqui você pode prosseguir para a avaliação
                realizarAvaliacao(cliente)
            }

            2 -> {
                val nomeProfissional = JOptionPane.showInputDialog("Digite seu nome:")
                val especialidadeProfissional = JOptionPane.showInputDialog("Digite sua especialidade:")

                val profissional = Profissional(
                    codigo = (1..1000).random(),
                    nome = nomeProfissional,
                    especialidade = especialidadeProfissional,
                )

                JOptionPane.showMessageDialog(
                    null, "Profissional ${profissional.nome} cadastrado com sucesso!"
                )

                // Aqui você pode permitir que o profissional avalie clientes
                avaliarClientes(profissional)
            }

            3 -> {
                JOptionPane.showMessageDialog(null, "Saindo do sistema...")
                break
            }

            else -> JOptionPane.showMessageDialog(null, "Escolha inválida, tente novamente.")
        }
    }
}

// Função para realizar a avaliação de serviços como cliente
fun realizarAvaliacao(cliente: Cliente) {
    val servicoEscolhido = JOptionPane.showInputDialog(
        null, "Escolha o serviço para avaliar:\n1. Cílios\n2. Sobrancelha\n3. Maquiagem"
    )?.toIntOrNull()

    val servico = when (servicoEscolhido) {
        1 -> Cilios("Extensão de Cílios", "Aplicação de extensão de cílios fio a fio.")
        2 -> Sobrancelha("Design de Sobrancelha", "Design de sobrancelha com henna.")
        3 -> Make("Maquiagem", "Maquiagem profissional para eventos especiais.")
        else -> null
    }

    if (servico != null) {
        val nota = JOptionPane.showInputDialog("Dê uma nota para o serviço (1 a 5):")?.toIntOrNull() ?: 0
        val anotacao = JOptionPane.showInputDialog("Deixe uma observação:")

        val feedback = Feedback(
            anotacoes = anotacao,
            nota = nota,
            agendamento = null,
            usuario = null,
            avaliador = cliente,
            servico = servico
        )

        JOptionPane.showMessageDialog(null, "Obrigado pela avaliação!")
    } else {
        JOptionPane.showMessageDialog(null, "Serviço inválido, voltando ao menu principal.")
    }
}

// Função para o profissional avaliar os clientes
fun avaliarClientes(profissional: Profissional) {
    val clienteNome = JOptionPane.showInputDialog("Digite o nome do cliente a ser avaliado:")
    val nota = JOptionPane.showInputDialog("Dê uma nota para o cliente (1 a 5):")?.toIntOrNull() ?: 0
    val anotacao = JOptionPane.showInputDialog("Deixe uma observação sobre o cliente:")

    val feedback = Feedback(
        anotacoes = anotacao,
        nota = nota,
        agendamento = null,
        usuario = null,
        avaliador = profissional,
        clienteAvaliado = Cliente(
            codigo = (1..1000).random(),
            nome = clienteNome,
            email = "email@exemplo.com",
            instagram = "@exemplo"
        ),
        servico = null
    )

    JOptionPane.showMessageDialog(null, "Avaliação do cliente $clienteNome realizada com sucesso!")
}

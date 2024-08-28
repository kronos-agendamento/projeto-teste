package sptech.projetojpa1.abstractmain

import sptech.projetojpa1.dominio.*
import javax.swing.JOptionPane
import javax.swing.JPasswordField

val clientesCadastrados = mutableListOf<Cliente>()
val profissionaisCadastrados = mutableListOf<Profissional>()
val feedbacks = mutableListOf<Feedback>()

fun main() {
    while (true) {
        val escolhaInicial = JOptionPane.showInputDialog(
            null, "Bem-vindo ao Sistema de Avaliação da Kronos!\n" +
                    "1. Login\n2. Cadastrar como Profissional\n3. Cadastrar como Cliente\n4. Sair"
        )?.toIntOrNull()

        when (escolhaInicial) {
            1 -> login()
            2 -> cadastrarProfissional()
            3 -> cadastrarCliente()
            4 -> {
                JOptionPane.showMessageDialog(null, "Saindo do sistema...")
                return
            }

            else -> JOptionPane.showMessageDialog(null, "Escolha inválida, tente novamente.")
        }
    }
}

fun login() {
    val email = JOptionPane.showInputDialog("Digite seu email:").trim()
    val senha = JOptionPane.showInputDialog("Digite sua senha:").trim()

    println("Tentando login com email: $email e senha: $senha")

    val cliente = clientesCadastrados.find { it.email == email && it.senha == senha }
    val profissional = profissionaisCadastrados.find { it.email == email && it.senha == senha }

    println("Cliente encontrado: $cliente")
    println("Profissional encontrado: $profissional")
    println("Lista de profissionais cadastrados: $profissionaisCadastrados")

    when {
        cliente != null -> menuCliente(cliente)
        profissional != null -> menuProfissional(profissional)
        else -> JOptionPane.showMessageDialog(null, "Email ou senha inválidos.")
    }
}


fun cadastrarCliente() {
    val nomeCliente = JOptionPane.showInputDialog("Digite seu nome:").checkNotEmpty("Nome")
    val emailCliente = JOptionPane.showInputDialog("Digite seu email:").checkNotEmpty("Email")
    val senhaCliente = JOptionPane.showInputDialog("Digite sua senha:").checkNotEmpty("Senha")
    val instagramCliente = JOptionPane.showInputDialog("Digite seu Instagram:").checkNotEmpty("Instagram")

    val cliente = Cliente(
        codigo = (1..1000).random(),
        nome = nomeCliente,
        email = emailCliente,
        instagram = instagramCliente,
        senha = senhaCliente
    )

    clientesCadastrados.add(cliente)
    JOptionPane.showMessageDialog(null, "Cliente ${cliente.nome} cadastrado com sucesso!")
}

fun cadastrarProfissional() {
    val nomeProfissional = JOptionPane.showInputDialog("Digite seu nome:").checkNotEmpty("Nome")
    val emailProfissional = JOptionPane.showInputDialog("Digite seu email:").checkNotEmpty("Email")
    val senhaProfissional = capturarSenha()

    if (senhaProfissional.isBlank()) {
        JOptionPane.showMessageDialog(null, "Senha não pode ser nula ou vazia!")
        return
    }

    println("Senha capturada: $senhaProfissional")

    val especialidadeProfissional =
        JOptionPane.showInputDialog("Digite sua especialidade:").checkNotEmpty("Especialidade")

    val profissional = Profissional(
        codigo = (1..1000).random(),
        nome = nomeProfissional,
        email = emailProfissional,
        especialidade = especialidadeProfissional,
        senha = senhaProfissional
    )

    profissionaisCadastrados.add(profissional)

    println("Profissional cadastrado: ${profissional.nome}")
    println("Email: ${profissional.email}")
    println("Senha: ${profissional.senha}")
    println("Especialidade: ${profissional.especialidade}")
    println("Lista de profissionais cadastrados: $profissionaisCadastrados")

    JOptionPane.showMessageDialog(null, "Profissional ${profissional.nome} cadastrado com sucesso!")
}


fun capturarSenha(): String {
    val passwordField = JPasswordField()
    val result = JOptionPane.showConfirmDialog(null, passwordField, "Digite sua senha", JOptionPane.OK_CANCEL_OPTION)
    return if (result == JOptionPane.OK_OPTION) {
        String(passwordField.password).trim()
    } else {
        ""
    }
}

fun menuCliente(cliente: Cliente) {
    while (true) {
        val escolha = JOptionPane.showInputDialog(
            null, "Bem-vindo, ${cliente.nome}!\n" +
                    "1. Avaliar Serviço\n2. Logout"
        )?.toIntOrNull()

        when (escolha) {
            1 -> realizarAvaliacao(cliente)
            2 -> return
            else -> JOptionPane.showMessageDialog(null, "Escolha inválida, tente novamente.")
        }
    }
}

fun menuProfissional(profissional: Profissional) {
    while (true) {
        val escolha = JOptionPane.showInputDialog(
            null, "Bem-vindo, ${profissional.nome}!\n" +
                    "1. Avaliar Cliente\n2. Ver Clientes\n3. Ver Serviços\n4. Logout"
        )?.toIntOrNull()

        when (escolha) {
            1 -> avaliarClientes(profissional)
            2 -> verClientes()
            3 -> verAvaliacoesServicos()
            4 -> return
            else -> JOptionPane.showMessageDialog(null, "Escolha inválida, tente novamente.")
        }
    }
}

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
            usuario = cliente,
            avaliador = cliente,
            servico = servico
        )

        feedbacks.add(feedback)
        JOptionPane.showMessageDialog(null, "Avaliação bem-sucedida!")
    } else {
        JOptionPane.showMessageDialog(null, "Serviço inválido, voltando ao menu.")
    }
}

fun avaliarClientes(profissional: Profissional) {
    if (clientesCadastrados.isEmpty()) {
        JOptionPane.showMessageDialog(null, "Nenhum cliente cadastrado para avaliar.")
        return
    }

    val listaClientes = clientesCadastrados.joinToString("\n") { it.nome.toString() }
    val clienteNome = JOptionPane.showInputDialog("Escolha um cliente para avaliar:\n$listaClientes")
    val clienteAvaliado = clientesCadastrados.find { it.nome == clienteNome }

    if (clienteAvaliado != null) {
        val nota = JOptionPane.showInputDialog("Dê uma nota para o cliente (1 a 5):")?.toIntOrNull() ?: 0
        val anotacao = JOptionPane.showInputDialog("Deixe uma observação sobre o cliente:")

        val feedback = Feedback(
            anotacoes = anotacao,
            nota = nota,
            agendamento = null,
            usuario = profissional,
            avaliador = profissional,
            clienteAvaliado = clienteAvaliado,
            servico = null
        )

        feedbacks.add(feedback)
        JOptionPane.showMessageDialog(null, "Avaliação realizada com sucesso!")
    } else {
        JOptionPane.showMessageDialog(null, "Cliente não encontrado.")
    }
}

fun verClientes() {
    if (clientesCadastrados.isEmpty()) {
        JOptionPane.showMessageDialog(null, "Nenhum cliente cadastrado.")
    } else {
        val listaClientes = clientesCadastrados.joinToString("\n") {
            val media = calcularMediaAvaliacoesCliente(it)
            "${it.nome} - Média de Avaliação: ${media ?: "Sem avaliações"}"
        }
        JOptionPane.showMessageDialog(null, "Clientes cadastrados:\n$listaClientes")
    }
}

fun verAvaliacoesServicos() {
    if (feedbacks.isEmpty()) {
        JOptionPane.showMessageDialog(null, "Nenhuma avaliação registrada.")
    } else {
        val servicos = feedbacks.groupBy { it.servico?.nome }
        val avaliacaoServicos = servicos.entries.joinToString("\n") { (servico, feedbacks) ->
            val media = feedbacks.mapNotNull { it.nota }.average()
            "$servico - Média de Avaliação: $media"
        }
        JOptionPane.showMessageDialog(null, "Avaliações de Serviços:\n$avaliacaoServicos")
    }
}

fun calcularMediaAvaliacoesCliente(cliente: Cliente): Double? {
    val feedbacksCliente = feedbacks.filter { it.clienteAvaliado == cliente }
    return if (feedbacksCliente.isNotEmpty()) {
        feedbacksCliente.mapNotNull { it.nota }.average()
    } else {
        null
    }
}

fun String?.checkNotEmpty(fieldName: String): String {
    return this?.takeIf { it.isNotBlank() } ?: throw IllegalArgumentException("$fieldName não pode ser vazio.")
}

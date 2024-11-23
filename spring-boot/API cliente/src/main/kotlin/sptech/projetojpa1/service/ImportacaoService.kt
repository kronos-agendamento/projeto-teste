package sptech.projetojpa1.service

import org.springframework.stereotype.Service
import sptech.projetojpa1.domain.Endereco
import sptech.projetojpa1.domain.usuario.Profissional
import sptech.projetojpa1.repository.EnderecoRepository
import sptech.projetojpa1.repository.UsuarioRepository
import java.time.LocalDate
import java.time.format.DateTimeFormatter

@Service
class ImportacaoService(
    private val usuarioRepository: UsuarioRepository,
    private val enderecoRepository: EnderecoRepository
) {
    fun importarArquivo(txtFile: String): String {
        val linhas = txtFile.lines()
        if (linhas.isEmpty()) throw IllegalArgumentException("O arquivo está vazio")
        println("Arquivo recebido com ${linhas.size} linhas") // Print do número de linhas totais

        // Valida o header
        val header = linhas.first()
        println("Header encontrado: $header") // Print do header
        if (!header.startsWith("00")) throw IllegalArgumentException("Header inválido")

        // Valida o trailer
        val trailer = linhas.last()
        println("Trailer bruto: '$trailer'") // Print do trailer bruto
        if (!trailer.trim().startsWith("01")) throw IllegalArgumentException("Trailer inválido")

        // Extrai o total de registros do trailer
        val totalRegistros = trailer.substring(2).trim().toIntOrNull() ?: 0
        println("Total de registros extraído do trailer: $totalRegistros") // Print do total extraído

        // Conta os registros de dados no arquivo
        val registrosDeDados = linhas.count { it.trimStart().startsWith("02") }
        println("Registros de dados encontrados no arquivo: $registrosDeDados") // Print da contagem de registros

        if (totalRegistros != registrosDeDados) {
            throw IllegalArgumentException("Quantidade de registros no trailer não bate. Esperado: $totalRegistros, Encontrado: $registrosDeDados")
        }

        // Processa os registros de dados
        val registros = linhas.subList(1, linhas.size - 1)
        registros.forEachIndexed { index, registro ->
            println("Processando registro #$index: $registro") // Print do registro em processamento
            if (!registro.startsWith("02")) throw IllegalArgumentException("Registro de dados inválido")
            processarRegistro(registro)
        }
        return "Importação realizada com sucesso! $totalRegistros registros processados."
    }

    private fun processarRegistro(registro: String) {
        println("Iniciando o processamento do registro: '$registro'") // Print do registro completo

        try {
            // Extração do código do usuário
            val rawCodigoUsuario = registro.substring(2, 12).trim()
            println("Código bruto extraído: '$rawCodigoUsuario'") // Print do valor bruto extraído
            val codigoUsuario = rawCodigoUsuario.toIntOrNull() ?: throw IllegalArgumentException("Código inválido")
            println("Código do usuário convertido: $codigoUsuario")

            // Extração de outros campos
            val nome = registro.substring(12, 62).trim()
            println("Nome extraído: '$nome'")

            val email = registro.substring(62, 112).trim()
            println("Email extraído: '$email'")

            val senha = registro.substring(112, 132).trim()
            println("Senha extraída: '$senha'")

            val instagram = registro.substring(132, 162).trim()
            println("Instagram extraído: '$instagram'")

            val cpf = registro.substring(162, 173).trim()
            println("CPF extraído: '$cpf'")

            val telefoneRaw = registro.substring(173, 188).trim()
            println("Telefone bruto extraído: '$telefoneRaw'")
            val telefone = telefoneRaw.toLongOrNull()
            println("Telefone convertido: $telefone")

            val dataNascimentoRaw = registro.substring(188, 198).trim()
            println("Data de nascimento bruta extraída: '$dataNascimentoRaw'")
            val dataNascimento = LocalDate.parse(dataNascimentoRaw, DateTimeFormatter.ofPattern("dd-MM-yyyy"))
            println("Data de nascimento convertida: $dataNascimento")

            val genero = registro.substring(198, 199).trim()
            println("Gênero extraído: '$genero'")

            val indicacao = registro.substring(199, 229).trim()
            println("Indicação extraída: '$indicacao'")

            val status = registro.substring(229, 230).trim().equals("A", ignoreCase = true)
            println("Status extraído: $status")

            val logradouro = registro.substring(230, 280).trim()
            println("Logradouro extraído: '$logradouro'")

            val cep = registro.substring(280, 288).trim()
            println("CEP extraído: '$cep'")

            val bairro = registro.substring(288, 318).trim()
            println("Bairro extraído: '$bairro'")

            val cidade = registro.substring(318, 348).trim()
            println("Cidade extraída: '$cidade'")

            val estado = registro.substring(348, 350).trim()
            println("Estado extraído: '$estado'")

            val numeroRaw = registro.substring(350, 355).trim()
            println("Número bruto extraído: '$numeroRaw'")
            val numero = numeroRaw.toIntOrNull()
            println("Número convertido: $numero")

            val complemento = registro.substring(355, 405).trim()
            println("Complemento extraído: '$complemento'")

            // Cria e salva o endereço
            val endereco = Endereco(
                logradouro = logradouro,
                cep = cep,
                bairro = bairro,
                cidade = cidade,
                estado = estado,
                numero = numero?.toString() ?: "",
                complemento = complemento
            )
            val enderecoSalvo = enderecoRepository.save(endereco)
            println("Endereço salvo: $enderecoSalvo")

            // Cria e salva o profissional
            val profissional = Profissional(
                codigo = codigoUsuario,
                nome = nome,
                email = email,
                senha = senha,
                instagram = instagram,
                cpf = cpf,
                telefone = telefone,
                dataNasc = dataNascimento,
                genero = genero,
                indicacao = indicacao,
                status = status,
                endereco = enderecoSalvo,
                nivelAcesso = null,
                empresa = null,
                especialidade = "Especialidade padrão"
            )
            usuarioRepository.save(profissional)
            println("Profissional salvo: $profissional")

        } catch (e: Exception) {
            println("Erro ao processar o registro: ${e.message}")
            throw IllegalArgumentException("Erro ao processar o registro: ${e.message}", e)
        }
    }
}

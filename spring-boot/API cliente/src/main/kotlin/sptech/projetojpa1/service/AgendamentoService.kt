package sptech.projetojpa1.service

import org.springframework.stereotype.Service
import sptech.projetojpa1.domain.Agendamento
import sptech.projetojpa1.domain.Usuario
import sptech.projetojpa1.dto.agendamento.AgendamentoDTO
import sptech.projetojpa1.dto.agendamento.AgendamentoRequestDTO
import sptech.projetojpa1.dto.agendamento.AgendamentoResponseDTO
import sptech.projetojpa1.repository.*
import java.time.LocalDate
import java.time.LocalTime
import java.util.*

@Service
class AgendamentoService(
    private val agendamentoRepository: AgendamentoRepository,
    private val usuarioRepository: UsuarioRepository,
    private val procedimentoRepository: ProcedimentoRepository,
    private val especificacaoRepository: EspecificacaoRepository,
    private val statusRepository: StatusRepository,
    private val empresaRepository: EmpresaRepository,

    ) {
    fun listarTodosAgendamentos(): List<AgendamentoResponseDTO> {
        val agendamentos = agendamentoRepository.findAll()

        return agendamentos.map { agendamento ->
            val usuario = agendamento.usuario
            AgendamentoResponseDTO(
                dataHorario = agendamento.dataHorario,
                idAgendamento = agendamento.idAgendamento,
                tipoAgendamento = agendamento.tipoAgendamento,
                usuario = usuario.nome,
                usuarioTelefone = usuario.telefone?.toString(),
                tempoAgendar = agendamento.tempoAgendar,
                homecare = agendamento.homecare,
                usuarioCpf = usuario.cpf ?: "CPF não disponível",
                usuarioId = usuario.codigo,
                procedimento = agendamento.procedimento?.tipo,
                especificacao = agendamento.especificacao?.especificacao,
                fkEspecificacao = agendamento.especificacao?.idEspecificacaoProcedimento,
                fkProcedimento = agendamento.procedimento?.idProcedimento,
                statusAgendamento = agendamento.statusAgendamento
            )
        }
    }

    fun criarAgendamento(agendamentoRequestDTO: AgendamentoRequestDTO): AgendamentoResponseDTO {
        // Validação preliminar de entrada para garantir que os campos essenciais estão preenchidos
        if (agendamentoRequestDTO.dataHorario == null || agendamentoRequestDTO.tipoAgendamento == null) {
            throw IllegalArgumentException("Data e tipo de agendamento não podem ser nulos")
        }

        // Adiciona o agendamento à fila de processamento
        // A fila é usada aqui para simular o conceito de processamento assíncrono, onde os agendamentos
        // são armazenados em uma lista (fila) e processados posteriormente, evitando o processamento imediato.
        println("Adicionando agendamento à fila: $agendamentoRequestDTO")
        filaAgendamentos.add(agendamentoRequestDTO)

        // Exibe a fila após adicionar o novo agendamento, mostrando que o item foi enfileirado.
        println("Fila de agendamentos após adicionar: $filaAgendamentos")

        // Chama o método de processamento da fila para processar os agendamentos enfileirados
        // Neste caso, o processamento está ocorrendo imediatamente após o enfileiramento, mas em um sistema real,
        // este processamento poderia ser feito de forma assíncrona ou agendada (por exemplo, a cada minuto).
        processarFilaDeAgendamentos()

        // Retorna uma resposta ao cliente indicando que o agendamento está sendo processado.
        // Como o processamento é "simulado" de forma assíncrona, o ID do agendamento ainda não está disponível,
        // mas outras informações podem ser retornadas enquanto o agendamento é tratado em segundo plano.
        return AgendamentoResponseDTO(
            idAgendamento = null,  // Um valor temporário, pois o agendamento ainda está sendo processado
            dataHorario = agendamentoRequestDTO.dataHorario,
            tipoAgendamento = agendamentoRequestDTO.tipoAgendamento,
            tempoAgendar = agendamentoRequestDTO.tempoAgendar,
            homecare = agendamentoRequestDTO.homecare,
            usuario = "Processando...",  // Indicador de que o processo ainda está em andamento
            procedimento = "Processando...",
            especificacao = "Processando...",
            statusAgendamento = statusRepository.findById(1)  // Um status fixo para indicar que o agendamento está pendente
                .orElseThrow { IllegalArgumentException("Status não encontrado") },
            usuarioTelefone = null,
            usuarioCpf = null,
            usuarioId = null,
            fkEspecificacao = null,
            fkProcedimento = null
        )
    }

    private val filaAgendamentos: Queue<AgendamentoRequestDTO> = LinkedList()

    fun obterAgendamentosPorStatus(): Map<String, Int> {
        // Consulta o repositório e obtém os dados
        val resultados = agendamentoRepository.contarAgendamentosPorStatus()

        // Cria um mapa para armazenar os valores finais
        val agendamentosPorStatus = mutableMapOf(
            "agendados" to 0,
            "confirmados" to 0,
            "realizados" to 0,
            "cancelados" to 0,
            "reagendados" to 0
        )

        // Percorre os resultados e preenche o mapa
        for (resultado in resultados) {
            val statusNome = resultado["status_nome"] as String
            val quantidade = (resultado["quantidade"] as Number).toInt()

            when (statusNome) {
                "Agendado" -> agendamentosPorStatus["agendados"] = quantidade
                "Confirmado" -> agendamentosPorStatus["confirmados"] = quantidade
                "Concluído" -> agendamentosPorStatus["realizados"] = quantidade
                "Cancelado" -> agendamentosPorStatus["cancelados"] = quantidade
                "Remarcado" -> agendamentosPorStatus["reagendados"] = quantidade
            }
        }
        return agendamentosPorStatus
    }

    fun obterTempoMedioEntreAgendamentos(): Double? {
        return agendamentoRepository.calcularTempoMedioEntreAgendamentosDoDia()
    }

    fun agendamentosRealizadosTrimestre(): Int {
        return agendamentoRepository.findAgendamentosConcluidosUltimoTrimestre()
    }

    fun tempoParaAgendar(): List<Int> {
        return agendamentoRepository.tempoParaAgendar()
    }

    fun totalAgendamentosHoje(): Int {
        return agendamentoRepository.findTotalAgendamentosHoje()
    }

    fun obterTotalAgendamentosFuturos(): Int {
        return agendamentoRepository.findTotalAgendamentosFuturos()
    }

    fun obterTotalReceitaUltimosTresMeses(): Map<String, Double> {
        return agendamentoRepository.findTotalReceitaUltimosTresMeses().associate {
            val procedimento = it[0] as String
            val totalReceita = (it[1] as Number).toDouble()  // Cuidado com o tipo aqui, converta para Double
            procedimento to totalReceita
        }
    }

    fun obterTempoGastoPorProcedimentoUltimoMes(): Map<String, Double> {
        return agendamentoRepository.findTempoGastoPorProcedimentoUltimoMes()
            .associate {
                val procedimento = it[0] as String
                val tempoTotal = (it[1] as Number).toDouble()
                procedimento to tempoTotal
            }
    }

    fun obterProcedimentosRealizadosUltimoTrimestre(): Map<String, Int> {
        return agendamentoRepository.findProcedimentosRealizadosUltimoTrimestre()
            .associate {
                val procedimento = it[0] as String
                val somaQtd = (it[1] as Number).toInt()
                procedimento to somaQtd
            }
    }


    fun obterValorTotalUltimoMesPorProcedimento(): Map<String, Double> {
        return agendamentoRepository.findValorTotalUltimoMesPorProcedimento()
            .associate {
                val procedimento = it[0] as String
                val valorTotal = (it[1] as Number).toDouble()
                procedimento to valorTotal  // Criamos um par (chave, valor) para o Map
            }
    }

    fun getAgendamentosPorIntervalo(startDate: LocalDate, endDate: LocalDate): List<Array<Any>> {
        return agendamentoRepository.findAgendamentosPorIntervalo(startDate, endDate)
    }

    fun agendamentosRealizadosUltimos5Meses(): List<Int> {
        return agendamentoRepository.findAgendamentosConcluidosUltimos5Meses()
    }

    fun listarHorariosDisponiveis(
        empresaId: Int,
        data: LocalDate
    ): List<LocalTime> {
        val empresa = empresaRepository.findById(empresaId)
            .orElseThrow { IllegalArgumentException("Empresa não encontrada") }

        val horarioFuncionamento = empresa.horarioFuncionamento
        val abertura = LocalTime.parse(horarioFuncionamento.horarioAbertura)
        val fechamento = LocalTime.parse(horarioFuncionamento.horarioFechamento)

        val agendamentosDoDia = agendamentoRepository.findByDataHorarioBetween(
            data.atTime(abertura),
            data.atTime(fechamento)
        ).filter { it.tipoAgendamento != "Bloqueio" }  // Exclui os bloqueios

        // Obter os horários já ocupados no dia específico
        val horariosOcupados = agendamentosDoDia.map {
            it.dataHorario?.toLocalTime() ?: throw IllegalArgumentException("Data e horário não podem ser nulos")
        }

        val horariosDisponiveis = mutableListOf<LocalTime>()

        var horarioAtual = abertura
        while (horarioAtual.isBefore(fechamento)) {
            // Verificar se o horário atual não está ocupado
            if (!horariosOcupados.contains(horarioAtual)) {
                horariosDisponiveis.add(horarioAtual)
            }
            horarioAtual = horarioAtual.plusMinutes(30) // Incrementa de 30 em 30 minutos
        }

        return horariosDisponiveis
    }

    fun validarAgendamento(agendamentoRequestDTO: AgendamentoRequestDTO): Boolean {
        val dataHorario = agendamentoRequestDTO.dataHorario
            ?: throw IllegalArgumentException("Data do agendamento não pode ser nula")

        val especificacao = especificacaoRepository.findById(agendamentoRequestDTO.fk_especificacao)
            .orElseThrow { IllegalArgumentException("Especificação não encontrada") }

        val duracao = when (agendamentoRequestDTO.tipoAgendamento) {
            "Colocação" -> LocalTime.parse(especificacao.tempoColocacao)
            "Manutenção" -> LocalTime.parse(especificacao.tempoManutencao)
            "Retirada" -> LocalTime.parse(especificacao.tempoRetirada)
            "Homecare" -> LocalTime.parse(especificacao.tempoColocacao)
            "Estudio" -> LocalTime.parse(especificacao.tempoColocacao)
            "Evento" -> LocalTime.parse(especificacao.tempoColocacao)
            else -> throw IllegalArgumentException("Tipo de agendamento inválido")
        }

        val horarioFinal =
            dataHorario.toLocalTime().plusHours(duracao.hour.toLong()).plusMinutes(duracao.minute.toLong())

        val horariosOcupados = agendamentoRepository.findByDataHorarioBetween(
            dataHorario,
            dataHorario.plusHours(duracao.hour.toLong()).plusMinutes(duracao.minute.toLong())
        )

        return horariosOcupados.isEmpty()
    }

    fun processarFilaDeAgendamentos() {
        // Processa todos os agendamentos presentes na fila.
        // A fila segue o conceito FIFO (First In, First Out), onde o primeiro agendamento a ser adicionado
        // será o primeiro a ser processado.
        while (filaAgendamentos.isNotEmpty()) {
            // Remove e obtém o primeiro agendamento da fila
            val agendamentoRequestDTO = filaAgendamentos.poll()

            // Exibe no log o agendamento que está sendo processado
            println("Processando agendamento: $agendamentoRequestDTO")

            // Validação de negócios para garantir que o agendamento é válido (exemplo: não existem conflitos de horário)
            if (!validarAgendamento(agendamentoRequestDTO)) {
                throw IllegalArgumentException("Já existe um agendamento para esse horário")
            }

            // Cria o objeto Agendamento baseado nos dados enfileirados
            // Neste ponto, o agendamento está pronto para ser salvo no banco de dados.
            val agendamento = Agendamento(
                dataHorario = agendamentoRequestDTO.dataHorario,
                tipoAgendamento = agendamentoRequestDTO.tipoAgendamento,
                tempoAgendar = agendamentoRequestDTO.tempoAgendar,
                usuario = usuarioRepository.findById(agendamentoRequestDTO.fk_usuario)
                    .orElseThrow { IllegalArgumentException("Usuário não encontrado") },
                procedimento = procedimentoRepository.findById(agendamentoRequestDTO.fk_procedimento)
                    .orElseThrow { IllegalArgumentException("Procedimento não encontrado") },
                especificacao = especificacaoRepository.findById(agendamentoRequestDTO.fk_especificacao)
                    .orElseThrow { IllegalArgumentException("Especificação não encontrada") },
                statusAgendamento = statusRepository.findById(agendamentoRequestDTO.fk_status)
                    .orElseThrow { IllegalArgumentException("Status não encontrado") }
            )

            // Exibe no log o agendamento que será salvo no banco de dados
            println("Salvando agendamento no banco de dados: $agendamento")

            // Salva o agendamento no banco de dados
            agendamentoRepository.save(agendamento)

            // Exibe no log que o agendamento foi salvo com sucesso
            println("Agendamento salvo com sucesso: $agendamento")
        }
    }

    fun obterAgendamento(id: Int): AgendamentoResponseDTO {
        val agendamento = agendamentoRepository.findById(id)
            .orElseThrow { IllegalArgumentException("Agendamento não encontrado") }

        return AgendamentoResponseDTO(
            idAgendamento = agendamento.idAgendamento,
            dataHorario = agendamento.dataHorario,
            tipoAgendamento = agendamento.tipoAgendamento,
            usuario = agendamento.usuario.nome,
            email = agendamento.usuario.email,
            tempoAgendar = agendamento.tempoAgendar,
            procedimento = agendamento.procedimento?.tipo,
            usuarioId = agendamento.usuario.codigo,
            especificacao = agendamento.especificacao?.especificacao,
            fkEspecificacao = agendamento.especificacao?.idEspecificacaoProcedimento,
            fkProcedimento = agendamento.procedimento?.idProcedimento,
            statusAgendamento = agendamento.statusAgendamento
        )
    }

    fun atualizarAgendamento(id: Int, agendamentoRequestDTO: AgendamentoRequestDTO): AgendamentoResponseDTO {
        val agendamento = agendamentoRepository.findById(id)
            .orElseThrow { IllegalArgumentException("Agendamento não encontrado") }

        agendamento.dataHorario =
            agendamentoRequestDTO.dataHorario ?: throw IllegalArgumentException("Data não pode ser nula")
        agendamento.tipoAgendamento = agendamentoRequestDTO.tipoAgendamento
            ?: throw IllegalArgumentException("Tipo de agendamento não pode ser nulo")
        agendamento.usuario = usuarioRepository.findById(agendamentoRequestDTO.fk_usuario)
            .orElseThrow { IllegalArgumentException("Usuário não encontrado") }
        agendamento.procedimento = procedimentoRepository.findById(agendamentoRequestDTO.fk_procedimento)
            .orElseThrow { IllegalArgumentException("Procedimento não encontrado") }
        agendamento.especificacao = especificacaoRepository.findById(agendamentoRequestDTO.fk_especificacao)
            .orElseThrow { IllegalArgumentException("Especificação não encontrada") }
        agendamento.statusAgendamento = statusRepository.findById(agendamentoRequestDTO.fk_status)
            .orElseThrow { IllegalArgumentException("Status não encontrado") }

        val updatedAgendamento = agendamentoRepository.save(agendamento)

        return AgendamentoResponseDTO(
            idAgendamento = updatedAgendamento.idAgendamento,
            dataHorario = updatedAgendamento.dataHorario,
            tipoAgendamento = updatedAgendamento.tipoAgendamento,
            usuario = agendamento.usuario.nome,
            procedimento = agendamento.procedimento?.tipo,
            especificacao = agendamento.especificacao?.especificacao,
            statusAgendamento = agendamento.statusAgendamento,
            usuarioId = agendamento.usuario.codigo,
            fkEspecificacao = agendamento.especificacao?.idEspecificacaoProcedimento,
            fkProcedimento = agendamento.procedimento?.idProcedimento
        )
    }

    fun atualizarStatusAgendamento(id: Int, novoStatusId: Int): AgendamentoResponseDTO {
        val agendamento = agendamentoRepository.findById(id)
            .orElseThrow { IllegalArgumentException("Agendamento não encontrado") }

        val novoStatus = statusRepository.findById(novoStatusId)
            .orElseThrow { IllegalArgumentException("Status não encontrado") }

        agendamento.statusAgendamento = novoStatus

        val updatedAgendamento = agendamentoRepository.save(agendamento)

        return AgendamentoResponseDTO(
            idAgendamento = updatedAgendamento.idAgendamento,
            dataHorario = updatedAgendamento.dataHorario,
            tipoAgendamento = updatedAgendamento.tipoAgendamento,
            usuario = agendamento.usuario.nome,
            procedimento = agendamento.procedimento?.tipo,
            especificacao = agendamento.especificacao?.especificacao,
            statusAgendamento = agendamento.statusAgendamento,
            usuarioId = agendamento.usuario.codigo,
            fkEspecificacao = agendamento.especificacao?.idEspecificacaoProcedimento,
            fkProcedimento = agendamento.procedimento?.idProcedimento
        )
    }

    fun excluirAgendamento(id: Int) {
        if (!agendamentoRepository.existsById(id)) {
            throw IllegalArgumentException("Agendamento não encontrado")
        }

        agendamentoRepository.deleteById(id)
    }

    fun filtrarAgendamentos(
        dataInicio: LocalDate?,
        dataFim: LocalDate?,
        clienteId: Int?,
        procedimentoId: Int?,
        especificacaoId: Int?
    ): List<AgendamentoResponseDTO> {
        val agendamentos = agendamentoRepository.findAll().filter { agendamento ->
            agendamento.tipoAgendamento != "Bloqueio" && // Exclui agendamentos com tipo "Bloqueio"
                    (dataInicio == null || agendamento.dataHorario?.toLocalDate() != null && agendamento.dataHorario!!.toLocalDate() >= dataInicio) &&
                    (dataFim == null || agendamento.dataHorario?.toLocalDate() != null && agendamento.dataHorario!!.toLocalDate() <= dataFim) &&
                    (clienteId == null || agendamento.usuario.codigo == clienteId) &&
                    (procedimentoId == null || agendamento.procedimento?.idProcedimento == procedimentoId) &&
                    (especificacaoId == null || agendamento.especificacao?.idEspecificacaoProcedimento == especificacaoId)
        }

        return agendamentos.map { agendamento ->
            val usuario = agendamento.usuario
            AgendamentoResponseDTO(
                idAgendamento = agendamento.idAgendamento,
                dataHorario = agendamento.dataHorario,
                tipoAgendamento = agendamento.tipoAgendamento,
                usuario = usuario.nome,
                usuarioTelefone = usuario.telefone?.toString(),
                usuarioCpf = usuario.cpf ?: "CPF não disponível",
                procedimento = agendamento.procedimento?.tipo,
                especificacao = agendamento.especificacao?.especificacao,
                statusAgendamento = agendamento.statusAgendamento,
                usuarioId = agendamento.usuario.codigo,
                fkEspecificacao = agendamento.especificacao?.idEspecificacaoProcedimento,
                fkProcedimento = agendamento.procedimento?.idProcedimento
            )
        }
    }

    fun bloquearHorarios(dia: LocalDate, horaInicio: LocalTime, horaFim: LocalTime, usuarioId: Int) {

        val horarioInicio = dia.atTime(horaInicio)
        val horarioFim = dia.atTime(horaFim)

        var horarioAtual = horarioInicio
        while (horarioAtual.isBefore(horarioFim)) {
            println("Bloqueando horário: $horarioAtual")
            println("Usuário: $usuarioId")

            val agendamentoFake = Agendamento(
                dataHorario = horarioAtual,
                tipoAgendamento = "Bloqueio",  // Tipo especial para identificar o bloqueio
                usuario = usuarioRepository.findById(usuarioId)
                    .orElseThrow { IllegalArgumentException("Usuário não encontrado") },
                procedimento = null,  // Permitir valor nulo para procedimento
                especificacao = null,  // Permitir valor nulo para especificação
                statusAgendamento = statusRepository.findById(2)  // Um ID fixo para "status bloqueado"
                    .orElseThrow { IllegalArgumentException("Status não encontrado") }
            )

            agendamentoRepository.save(agendamentoFake)
            horarioAtual = horarioAtual.plusMinutes(30)  // Incrementa de 30 em 30 minutos
        }
    }

    fun desbloquearHorarios(dia: LocalDate, horaInicio: LocalTime) {
        val horarioInicio = dia.atTime(horaInicio) // Cria o horário inicial com a data especificada

        // Busca os agendamentos do tipo "Bloqueio" que começam no horário exato
        val agendamentosBloqueados = agendamentoRepository.findByDataHorario(horarioInicio)
            .filter { it.tipoAgendamento == "Bloqueio" }

        if (agendamentosBloqueados.isNotEmpty()) {
            // Deleta todos os agendamentos do tipo "Bloqueio" encontrados no horário exato
            agendamentoRepository.deleteAll(agendamentosBloqueados)
            println("Horários bloqueados às $horarioInicio foram desbloqueados com sucesso!")
        } else {
            println("Nenhum horário bloqueado encontrado para $horarioInicio.")
        }
    }

    fun countUsuariosWithStatusZero(): Int {
        return usuarioRepository.countByStatus(false)
    }

    fun countUsuariosWithStatusUm(): Int {
        return usuarioRepository.countByStatus(true)
    }

    fun listarAgendamentosPorUsuario(usuarioId: Int): List<AgendamentoDTO> {
        return agendamentoRepository.listarAgendamentosPorUsuario(usuarioId)
    }

    fun countDiasUltimoAgendamento(idUsuario: Int): Int {
        val usuario: Usuario = usuarioRepository.findById(idUsuario)
            .orElseThrow { IllegalArgumentException("Usuário não encontrado") }
        return agendamentoRepository.countDiasUltimoAgendamento(usuario) ?: 0
    }

    fun buscarDiaMaisAgendadoPorUsuario(idUsuario: Int): String {
        return agendamentoRepository.buscarDiaMaisAgendadoPorUsuario(idUsuario)
    }

    fun obterProcedimentosPorUsuarioEMes(usuarioId: Long, mesAno: String): Map<String, Int> {
        return agendamentoRepository.findProcedimentosPorUsuarioEMes(usuarioId, mesAno)
            .associate {
                val procedimento = it[0] as String  // O primeiro elemento é o nome do procedimento
                val quantidade = (it[1] as Number).toInt()  // O segundo elemento é a quantidade
                procedimento to quantidade
            }
    }

    fun getMostBookedTimeByUser(idUsuario: Int): String? {
        return agendamentoRepository.findMostBookedTimeByUser(idUsuario)
    }

    // Função de cálculo de orçamento
    fun obterPrecoOrcamento(idEspecificacao: Int, tipoAgendamento: String): Double? {
        return agendamentoRepository.findPrecoByTipoAgendamento(idEspecificacao, tipoAgendamento)
    }

}
    

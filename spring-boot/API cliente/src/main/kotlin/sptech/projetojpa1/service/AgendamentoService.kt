package sptech.projetojpa1.service

import org.springframework.stereotype.Service
import sptech.projetojpa1.domain.Agendamento
import sptech.projetojpa1.domain.Usuario
import sptech.projetojpa1.dto.agendamento.AgendamentoRequestDTO
import sptech.projetojpa1.dto.agendamento.AgendamentoResponseDTO
import sptech.projetojpa1.repository.*
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.LocalTime

@Service
class AgendamentoService(
    private val agendamentoRepository: AgendamentoRepository,
    private val usuarioRepository: UsuarioRepository,
    private val procedimentoRepository: ProcedimentoRepository,
    private val especificacaoRepository: EspecificacaoRepository,
    private val statusRepository: StatusRepository,
    private val empresaRepository: EmpresaRepository
) {

    fun listarTodosAgendamentos(): List<AgendamentoResponseDTO> {
        val agendamentos = agendamentoRepository.findAll()

        // Filtra os agendamentos para excluir aqueles com tipoAgendamento igual a "Bloqueio"
        val agendamentosFiltrados = agendamentos.filter { it.tipoAgendamento != "Bloqueio" }

        return agendamentosFiltrados.map { agendamento ->
            val usuario = agendamento.usuario
            AgendamentoResponseDTO(
                idAgendamento = agendamento.idAgendamento,
                dataHorario = agendamento.dataHorario,
                tipoAgendamento = agendamento.tipoAgendamento,
                usuario = usuario.nome,
                usuarioTelefone = usuario.telefone?.toString(),
                tempoAgendar = agendamento.tempoAgendar,
                usuarioCpf = usuario.cpf ?: "CPF não disponível",
                procedimento = agendamento.procedimento.tipo,
                especificacao = agendamento.especificacao.especificacao,
                statusAgendamento = agendamento.statusAgendamento
            )
        }
    }

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

        val horariosOcupados = agendamentosDoDia.map {
            it.dataHorario?.toLocalTime() ?: throw IllegalArgumentException("Data e horário não podem ser nulos")
        }

        val horariosDisponiveis = mutableListOf<LocalTime>()

        var horarioAtual = abertura
        while (horarioAtual.isBefore(fechamento)) {
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


    fun criarAgendamento(agendamentoRequestDTO: AgendamentoRequestDTO): AgendamentoResponseDTO {
        if (!validarAgendamento(agendamentoRequestDTO)) {
            throw IllegalArgumentException("Já existe um agendamento para esse horário")
        }

        val agendamento = Agendamento(
            dataHorario = agendamentoRequestDTO.dataHorario
                ?: throw IllegalArgumentException("Data não pode ser nula"),
            tipoAgendamento = agendamentoRequestDTO.tipoAgendamento
                ?: throw IllegalArgumentException("Tipo de agendamento não pode ser nulo"),
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

        val savedAgendamento = agendamentoRepository.save(agendamento)

        return AgendamentoResponseDTO(
            idAgendamento = savedAgendamento.idAgendamento,
            dataHorario = savedAgendamento.dataHorario,
            tipoAgendamento = savedAgendamento.tipoAgendamento,
            tempoAgendar = savedAgendamento.tempoAgendar,
            usuario = agendamento.usuario.nome,
            procedimento = agendamento.procedimento.tipo,
            especificacao = agendamento.especificacao.especificacao,
            statusAgendamento = agendamento.statusAgendamento
        )
    }

    fun obterAgendamento(id: Int): AgendamentoResponseDTO {
        val agendamento = agendamentoRepository.findById(id)
            .orElseThrow { IllegalArgumentException("Agendamento não encontrado") }

        return AgendamentoResponseDTO(
            idAgendamento = agendamento.idAgendamento,
            dataHorario = agendamento.dataHorario,
            tipoAgendamento = agendamento.tipoAgendamento,
            usuario = agendamento.usuario.nome,
            tempoAgendar = agendamento.tempoAgendar,
            procedimento = agendamento.procedimento.tipo,
            especificacao = agendamento.especificacao.especificacao,
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
            procedimento = agendamento.procedimento.tipo,
            especificacao = agendamento.especificacao.especificacao,
            tempoAgendar = agendamento.tempoAgendar,
            statusAgendamento = agendamento.statusAgendamento
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
            tempoAgendar = agendamento.tempoAgendar,
            procedimento = agendamento.procedimento.tipo,
            especificacao = agendamento.especificacao.especificacao,
            statusAgendamento = agendamento.statusAgendamento
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
                    (procedimentoId == null || agendamento.procedimento.idProcedimento == procedimentoId) &&
                    (especificacaoId == null || agendamento.especificacao.idEspecificacaoProcedimento == especificacaoId)
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
                tempoAgendar = agendamento.tempoAgendar,
                procedimento = agendamento.procedimento.tipo,
                especificacao = agendamento.especificacao.especificacao,
                statusAgendamento = agendamento.statusAgendamento
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
                tempoAgendar = null,
                procedimento = procedimentoRepository.findById(1)  // Um ID fixo para o "procedimento bloqueio"
                    .orElseThrow { IllegalArgumentException("Procedimento não encontrado") },
                especificacao = especificacaoRepository.findById(1)  // Um ID fixo para a "especificação bloqueio"
                    .orElseThrow { IllegalArgumentException("Especificação não encontrada") },
                statusAgendamento = statusRepository.findById(1)  // Um ID fixo para "status bloqueado"
                    .orElseThrow { IllegalArgumentException("Status não encontrado") }
            )

            agendamentoRepository.save(agendamentoFake)
            horarioAtual = horarioAtual.plusMinutes(30)  // Incrementa de 30 em 30 minutos
        }
    }

    fun countUsuariosWithStatusZero(): Int {
        return usuarioRepository.countByStatus(false)
    }

    fun countUsuariosWithStatusUm(): Int {
        return usuarioRepository.countByStatus(true)
    }

    fun countDiasUltimoAgendamento(idUsuario: Int): Int {
        val usuario: Usuario = usuarioRepository.findById(idUsuario)
            .orElseThrow { IllegalArgumentException("Usuário não encontrado") }
        return agendamentoRepository.countDiasUltimoAgendamento(usuario) ?: 0
    }

        fun buscarDiaMaisAgendadoPorUsuario(idUsuario: Int): String {
            return agendamentoRepository.buscarDiaMaisAgendadoPorUsuario(idUsuario)
        }

    fun getMostBookedTimeByUser(idUsuario: Int): String? {
        return agendamentoRepository.findMostBookedTimeByUser(idUsuario)
    }
}


package sptech.projetojpa1.repository

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import sptech.projetojpa1.domain.Agendamento
import sptech.projetojpa1.domain.Usuario
import sptech.projetojpa1.dto.agendamento.AgendamentoDTO
import java.time.LocalDateTime
import java.time.LocalDate

@Repository
interface AgendamentoRepository : JpaRepository<Agendamento, Int> {

    @Query("SELECT a FROM Agendamento a WHERE a.dataHorario = :dataHorario")
    fun findByDataHorario(@Param("dataHorario") dataHorario: LocalDateTime): List<Agendamento>

    @Query(
        nativeQuery = true, value = """
    SELECT
        (SUM(a.tempo_para_agendar) / COUNT(a.id_agendamento)) AS media_tempo_para_agendar
    FROM
        agendamento a
    WHERE
        a.tempo_para_agendar IS NOT NULL;
    """
    )
    fun tempoParaAgendar(): List<Int>

    @Query(
        """
        WITH AgendamentosDoDia AS (
            SELECT data_horario
            FROM agendamento
            WHERE DATE(data_horario) = CURDATE()
            ORDER BY data_horario
        ),
        DiferencasEntreAgendamentos AS (
            SELECT TIMESTAMPDIFF(MINUTE, LAG(data_horario) OVER (ORDER BY data_horario), data_horario) AS diferenca
            FROM AgendamentosDoDia
        )
        SELECT AVG(diferenca) 
        FROM DiferencasEntreAgendamentos
        WHERE diferenca IS NOT NULL;
        """, nativeQuery = true
    )
    fun calcularTempoMedioEntreAgendamentosDoDia(): Double?

    @Query(
        """
        SELECT 
            sa.nome AS status_nome,
            COUNT(a.id_agendamento) AS quantidade
        FROM 
            agendamento a
        JOIN 
            status sa ON a.fk_status = sa.id_status_agendamento
        WHERE 
            sa.nome IN ('Agendado', 'Confirmado', 'Concluído', 'Cancelado', 'Remarcado')  -- Apenas os status relevantes
        GROUP BY 
            sa.nome
    """, nativeQuery = true
    )
    fun contarAgendamentosPorStatus(): List<Map<String, Any>>


    @Query(
        nativeQuery = true, value = """ 
        SELECT COUNT(*) AS agendamentos_marcados_hoje
        FROM agendamento
        WHERE DATE(data_horario) = CURDATE();
    """
    )
    fun findTotalAgendamentosHoje(): Int


    @Query(
        nativeQuery = true, value = """
    SELECT COUNT(*) AS agendamentos_futuros
    FROM agendamento
    WHERE DATE(data_horario) > CURDATE();
    """
    )
    fun findTotalAgendamentosFuturos(): Int

    @Query(
        nativeQuery = true, value = """
        SELECT p.tipo AS procedimento, 
               SUM(CASE 
                   WHEN a.tipo_agendamento = 'colocacao' THEN e.preco_colocacao
                   WHEN a.tipo_agendamento = 'manutencao' THEN e.preco_manutencao
                   WHEN a.tipo_agendamento = 'retirada' THEN e.preco_retirada
               END) AS totalReceita
        FROM agendamento a
        JOIN especificacao e ON a.fk_especificacao_procedimento = e.id_especificacao_procedimento
        JOIN procedimento p ON e.fk_procedimento = p.id_procedimento
        WHERE a.data_horario >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH)
        GROUP BY p.tipo;
        """
    )
    fun findTotalReceitaUltimosTresMeses(): List<Array<Any>>

    @Query(
        nativeQuery = true, value = """
        SELECT 
            p.tipo AS Procedimento, 
            COUNT(*) AS soma_qtd
        FROM 
            agendamento a
        JOIN 
            especificacao e ON a.fk_especificacao_procedimento = e.id_especificacao_procedimento
        JOIN 
            procedimento p ON e.fk_procedimento = p.id_procedimento
        WHERE 
            a.data_horario >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH)
        GROUP BY 
            p.tipo
        ORDER BY 
            soma_qtd DESC;
        """
    )
    fun findProcedimentosRealizadosUltimoTrimestre(): List<Array<Any>>

    @Query(
        nativeQuery = true, value = """
        SELECT 
            p.tipo AS Procedimento, 
            SUM(
                CASE 
                    WHEN a.tipo_agendamento = 'colocacao' THEN e.preco_colocacao * (TIME_TO_SEC(e.tempo_colocacao) / 3600)
                    WHEN a.tipo_agendamento = 'manutencao' THEN e.preco_manutencao * (TIME_TO_SEC(e.tempo_manutencao) / 3600)
                    WHEN a.tipo_agendamento = 'retirada' THEN e.preco_retirada * (TIME_TO_SEC(e.tempo_retirada) / 3600)
                    ELSE 0
                END
            ) AS Valor_Total_Procedimento
        FROM 
            agendamento a
        JOIN 
            especificacao e ON a.fk_especificacao_procedimento = e.id_especificacao_procedimento
        JOIN 
            procedimento p ON e.fk_procedimento = p.id_procedimento
        WHERE 
            a.data_horario >= DATE_FORMAT(CURDATE() - INTERVAL 1 MONTH, '%Y-%m-01')
            AND a.data_horario < DATE_FORMAT(CURDATE(), '%Y-%m-01')
        GROUP BY 
            p.tipo
        ORDER BY 
            p.tipo;
        """
    )
    fun findValorTotalUltimoMesPorProcedimento(): List<Array<Any>>

    @Query(
        nativeQuery = true, value = """
        SELECT 
    p.tipo AS Procedimento, 
    SUM(
        CASE 
            WHEN a.tipo_agendamento = 'colocacao' THEN TIME_TO_SEC(e.tempo_colocacao)
            WHEN a.tipo_agendamento = 'manutencao' THEN TIME_TO_SEC(e.tempo_manutencao)
            WHEN a.tipo_agendamento = 'retirada' THEN TIME_TO_SEC(e.tempo_retirada)
            ELSE 0
        END
    ) / 60 AS Tempo_Total_Minutos
FROM 
    agendamento a
JOIN 
    especificacao e ON a.fk_especificacao_procedimento = e.id_especificacao_procedimento
JOIN 
    procedimento p ON e.fk_procedimento = p.id_procedimento
WHERE 
    a.data_horario >= DATE_FORMAT(CURDATE() - INTERVAL 1 MONTH, '%Y-%m-01')
    AND a.data_horario < DATE_FORMAT(CURDATE(), '%Y-%m-01')
GROUP BY 
    p.tipo
ORDER BY 
    p.tipo;

        """
    )
    fun findTempoGastoPorProcedimentoUltimoMes(): List<Array<Any>>  // Retorna uma lista de objetos com Procedimento e Tempo_Total


    @Query(
        nativeQuery = true, value = """ 
        SELECT
                COUNT(a.id_agendamento) AS quantidade_concluidos
                FROM
                agendamento a
                INNER JOIN
                status s ON a.fk_status = s.id_status_agendamento
                WHERE
                s.nome = 'Concluído'
                AND a.data_horario >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH);"""
    )
    fun findAgendamentosConcluidosUltimoTrimestre(): Int

    @Query(
        nativeQuery = true, value = """ 
        SELECT 
                COUNT(*) AS quantidade_agendamentos
            FROM 
                agendamento
            WHERE 
                data_horario >= DATE_SUB(CURDATE(), INTERVAL 5 MONTH)
            GROUP BY 
                YEAR(data_horario), MONTH(data_horario)
            ORDER BY 
                YEAR(data_horario) DESC, MONTH(data_horario) DESC;
        """
    )
    fun findAgendamentosConcluidosUltimos5Meses(): List<Int>

    @Query("SELECT a FROM Agendamento a WHERE a.dataHorario BETWEEN :dataInicio AND :dataFim")
    fun findByDataHorarioBetween(
        @Param("dataInicio") dataInicio: LocalDateTime,
        @Param("dataFim") dataFim: LocalDateTime
    ): List<Agendamento>

    fun deleteAllByUsuario(usuario: Usuario)

    @Query("SELECT DATEDIFF(NOW(), dataHorario) FROM Agendamento WHERE usuario = :usuario AND dataHorario IS NOT NULL AND dataHorario <= NOW() ORDER BY dataHorario DESC LIMIT 1")
    fun countDiasUltimoAgendamento(@Param("usuario") usuario: Usuario): Int?

    @Query(
        """
    SELECT CASE DAYOFWEEK(a.data_horario)
               WHEN 1 THEN 'Domingo'
               WHEN 2 THEN 'Segunda'
               WHEN 3 THEN 'Terça'
               WHEN 4 THEN 'Quarta'
               WHEN 5 THEN 'Quinta'
               WHEN 6 THEN 'Sexta'
               WHEN 7 THEN 'Sábado'
           END AS DiaSemana
    FROM agendamento a
    WHERE a.fk_usuario = :idUsuario
    GROUP BY DiaSemana
    ORDER BY COUNT(*) DESC
    LIMIT 1
""", nativeQuery = true
    )
    fun buscarDiaMaisAgendadoPorUsuario(idUsuario: Int): String

    @Query(
        """
        SELECT 
            DATE_FORMAT(MIN(data_horario), '%Y-%m-01') AS data_horario,
            COUNT(*) AS quantidade_agendamentos
        FROM 
            agendamento
        WHERE 
            data_horario BETWEEN :startDate AND :endDate
        GROUP BY 
            YEAR(data_horario), MONTH(data_horario)
        ORDER BY 
            YEAR(data_horario) DESC, MONTH(data_horario) DESC
        """,
        nativeQuery = true
    )
    fun findAgendamentosPorIntervalo(
        @Param("startDate") startDate: LocalDate,
        @Param("endDate") endDate: LocalDate
    ): List<Array<Any>>

    @Query(
        """
    SELECT 
        CASE 
            WHEN HOUR(a.data_horario) BETWEEN 0 AND 3 THEN '00:00 até 04:00'
            WHEN HOUR(a.data_horario) BETWEEN 4 AND 7 THEN '04:00 até 08:00'
            WHEN HOUR(a.data_horario) BETWEEN 8 AND 11 THEN '08:00 até 12:00'
            WHEN HOUR(a.data_horario) BETWEEN 12 AND 15 THEN '12:00 até 16:00'
            WHEN HOUR(a.data_horario) BETWEEN 16 AND 19 THEN '16:00 até 20:00'
            WHEN HOUR(a.data_horario) BETWEEN 20 AND 23 THEN '20:00 até 00:00'
        END AS IntervaloTempo
    FROM Agendamento a
    WHERE a.fk_usuario = :idUsuario
    GROUP BY IntervaloTempo
    ORDER BY COUNT(*) DESC
    LIMIT 1
""", nativeQuery = true
    )
    fun findMostBookedTimeByUser(idUsuario: Int): String?

    @Query(
        nativeQuery = true, value = """
        SELECT 
            e.especificacao AS Procedimento, 
            COUNT(*) AS qtd_procedimentos
        FROM 
            agendamento a
        JOIN 
            especificacao e ON a.fk_especificacao_procedimento = e.id_especificacao_procedimento
        JOIN 
            usuario u ON a.fk_usuario = u.id_usuario
        WHERE 
            u.id_usuario = :usuarioId  -- ID do usuário específico
            AND DATE_FORMAT(a.data_horario, '%Y-%m') = :mesAno  -- Mês e ano específicos no formato YYYY-MM
            AND a.data_horario >= CURDATE() - INTERVAL 1 YEAR  -- Apenas procedimentos do último ano
        GROUP BY 
            e.especificacao
        ORDER BY 
            qtd_procedimentos DESC;
        """
    )
    fun findProcedimentosPorUsuarioEMes(
        @Param("usuarioId") usuarioId: Long,
        @Param("mesAno") mesAno: String
    ): List<Array<Any>>  // Retorna uma lista com Procedimento e a quantidade

    @Query(
        """
SELECT new sptech.projetojpa1.dto.agendamento.AgendamentoDTO(
        u.nome, a.idAgendamento, a.usuario.id, a.dataHorario, a.tipoAgendamento, 
        p.tipo, e.especificacao, p.idProcedimento, e.idEspecificacaoProcedimento, s.nome
    )
    FROM Agendamento a
    JOIN a.usuario u
    JOIN a.procedimento p
    JOIN a.especificacao e
    JOIN a.statusAgendamento s
    WHERE a.usuario.id = :usuarioId
    ORDER BY a.dataHorario DESC
    """
    )
    fun listarAgendamentosPorUsuario(usuarioId: Int): List<AgendamentoDTO>

    fun findAllByUsuario(usuario: Usuario): List<Agendamento>

    fun findByTipoAgendamento(tipoAgendamento: String): List<Agendamento>

    @Query(
        """
    SELECT 
        CASE 
            WHEN LOWER(:tipoAgendamento) = 'colocacao' THEN e.preco_colocacao 
            WHEN LOWER(:tipoAgendamento) = 'manutencao' THEN e.preco_manutencao 
            WHEN LOWER(:tipoAgendamento) = 'retirada' THEN e.preco_retirada 
            ELSE NULL 
        END 
    FROM especificacao e 
    WHERE e.id_especificacao_procedimento = :idEspecificacao
    """, nativeQuery = true
    )
    fun findPrecoByTipoAgendamento(
        @Param("idEspecificacao") idEspecificacao: Int,
        @Param("tipoAgendamento") tipoAgendamento: String
    ): Double?

}

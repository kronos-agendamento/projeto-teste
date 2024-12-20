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
        a.tempo_para_agendar IS NOT NULL
        AND a.data_horario >= COALESCE(:startDate, a.data_horario)
        AND a.data_horario <= COALESCE(:endDate, a.data_horario);
    """
    )
    fun tempoParaAgendar(
        @Param("startDate") startDate: String?,
        @Param("endDate") endDate: String?
    ): List<Int>

    @Query(
        """
    SELECT 
    AVG(
        CASE 
            WHEN DATE(data_horario) = DATE(proximo_agendamento) 
                THEN TIMESTAMPDIFF(MINUTE, data_horario, proximo_agendamento)
            ELSE TIMESTAMPDIFF(MINUTE, data_horario, proximo_agendamento) 
                 - TIMESTAMPDIFF(MINUTE, '18:00:00', '08:00:00')
        END
    ) AS media_tempo_entre_agendamentos
FROM (
    SELECT 
        data_horario,
        LEAD(data_horario) OVER (ORDER BY data_horario) AS proximo_agendamento
    FROM 
        agendamento
    WHERE 
        data_horario BETWEEN COALESCE(:startDate, DATE_SUB(CURDATE(), INTERVAL 1 MONTH)) 
                         AND COALESCE(:endDate, CURDATE())
        AND TIME(data_horario) BETWEEN '08:00:00' AND '18:00:00' -- Considera apenas o horário comercial
) AS intervalo
WHERE 
    proximo_agendamento IS NOT NULL;



    """,
        nativeQuery = true
    )
    fun calcularMediaTempoEntreAgendamentos(
        @Param("startDate") startDate: String?,
        @Param("endDate") endDate: String?
    ): Double?



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
        value = """
        SELECT 
            sa.nome AS status_nome,
            COUNT(a.id_agendamento) AS quantidade
        FROM 
            agendamento a
        JOIN 
            status sa ON a.fk_status = sa.id_status_agendamento
        WHERE 
            sa.nome IN ('Agendado', 'Confirmado', 'Concluído', 'Cancelado', 'Remarcado') 
            AND DATE(a.data_horario) = COALESCE(:startDate, CURDATE()) 
        GROUP BY 
            sa.nome
    """,
        nativeQuery = true
    )
    fun contarAgendamentosPorStatus(@Param("startDate") startDate: String?): List<Map<String, Any>>



    @Query(
        nativeQuery = true, value = """ 
    SELECT COUNT(*) AS agendamentos_no_dia
    FROM agendamento
    WHERE DATE(data_horario) = COALESCE(:startDate, CURDATE());
    """
    )
    fun findTotalAgendamentosPorDia(
        @Param("startDate") startDate: String?
    ): Int



    @Query(
        nativeQuery = true, value = """
    SELECT COUNT(*) AS total_agendamentos_futuros
    FROM agendamento
    WHERE data_horario > NOW()
    AND data_horario >= COALESCE(:startDate, NOW())
    AND data_horario <= COALESCE(:endDate, DATE_ADD(NOW(), INTERVAL 1 YEAR));
    """
    )
    fun findTotalAgendamentosFuturos(
        @Param("startDate") startDate: String?,
        @Param("endDate") endDate: String?
    ): Int


    @Query(
        nativeQuery = true, value = """
        SELECT 
            p.tipo AS procedimento, 
            SUM(
                CASE 
                    WHEN a.tipo_agendamento = 'colocacao' THEN e.preco_colocacao
                    WHEN a.tipo_agendamento = 'manutencao' THEN e.preco_manutencao
                    WHEN a.tipo_agendamento = 'retirada' THEN e.preco_retirada
                    ELSE 0
                END
            ) AS totalReceita
        FROM 
            agendamento a
        JOIN 
            especificacao e ON a.fk_especificacao_procedimento = e.id_especificacao_procedimento
        JOIN 
            procedimento p ON e.fk_procedimento = p.id_procedimento
        WHERE 
            a.data_horario BETWEEN 
            COALESCE(:startDate, DATE_SUB(CURDATE(), INTERVAL 3 MONTH)) AND 
            COALESCE(:endDate, CURDATE())
        GROUP BY 
            p.tipo
    """
    )
    fun findTotalReceitaEntreDatas(
        @Param("startDate") startDate: String?,
        @Param("endDate") endDate: String?
    ): List<Array<Any>>


    @Query(
        nativeQuery = true, value = """
        SELECT 
            p.tipo AS procedimento, 
            COUNT(*) AS soma_qtd
        FROM 
            agendamento a
        JOIN 
            especificacao e ON a.fk_especificacao_procedimento = e.id_especificacao_procedimento
        JOIN 
            procedimento p ON e.fk_procedimento = p.id_procedimento
        WHERE 
            a.data_horario BETWEEN COALESCE(:startDate, DATE_SUB(CURDATE(), INTERVAL 3 MONTH)) 
                              AND COALESCE(:endDate, CURDATE())
        GROUP BY 
            p.tipo
        ORDER BY 
            soma_qtd DESC
    """
    )
    fun findProcedimentosRealizadosEntreDatas(
        @Param("startDate") startDate: String?,
        @Param("endDate") endDate: String?
    ): List<Array<Any>>



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
            a.data_horario BETWEEN COALESCE(:startDate, DATE_SUB(CURDATE(), INTERVAL 1 MONTH)) 
                              AND COALESCE(:endDate, CURDATE())
        GROUP BY 
            p.tipo
        ORDER BY 
            Valor_Total_Procedimento DESC;
    """
    )
    fun findValorTotalEntreDatas(
        @Param("startDate") startDate: String?,
        @Param("endDate") endDate: String?
    ): List<Array<Any>>


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
            a.data_horario BETWEEN 
            COALESCE(:startDate, DATE_SUB(CURDATE(), INTERVAL 1 MONTH)) AND 
            COALESCE(:endDate, CURDATE())
        GROUP BY 
            p.tipo
        ORDER BY 
            Tempo_Total_Minutos DESC
    """
    )
    fun findTempoGastoPorProcedimentoEntreDatas(
        @Param("startDate") startDate: String?,
        @Param("endDate") endDate: String?
    ): List<Array<Any>>





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
        AND
            a.data_horario BETWEEN COALESCE(:startDate, DATE_SUB(CURDATE(), INTERVAL 3 MONTH))
                            AND COALESCE(:endDate, CURDATE());
    """
    )
    fun findAgendamentosConcluidosUltimoTrimestre(
        @Param("startDate") startDate: String?,
        @Param("endDate") endDate: String?
    ): Int


    @Query(
        nativeQuery = true, value = """ 
    SELECT 
    DATE_FORMAT(data_horario, '%Y-%m') AS mes_ano, 
    COUNT(*) AS quantidade_agendamentos
FROM 
    agendamento
WHERE 
    data_horario BETWEEN :startDate AND :endDate
GROUP BY 
    DATE_FORMAT(data_horario, '%Y-%m')
ORDER BY 
    mes_ano DESC;
    """
    )
    fun findAgendamentosConcluidos(
        @Param("startDate") startDate: String,
        @Param("endDate") endDate: String
    ): List<Map<String, Any>>



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

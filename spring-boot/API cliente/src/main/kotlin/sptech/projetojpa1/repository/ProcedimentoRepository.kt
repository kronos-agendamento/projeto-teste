package sptech.projetojpa1.repository

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import sptech.projetojpa1.domain.Procedimento

interface ProcedimentoRepository : JpaRepository<Procedimento, Int> {

    @Query(
        "SELECT p.idProcedimento AS idProcedimento, p.tipo AS tipo, COUNT(a.idAgendamento) AS totalAgendamentos " +
                "FROM Agendamento a JOIN a.procedimento p " +
                "GROUP BY p.idProcedimento, p.tipo " +
                "ORDER BY totalAgendamentos DESC"
    )
    fun findProcedimentoMaisAgendado(): List<Map<String, Any>>

    @Query(
        "SELECT p.idProcedimento AS idProcedimento, p.tipo AS tipo, COUNT(a.idAgendamento) AS totalAgendamentos " +
                "FROM Agendamento a JOIN a.procedimento p " +
                "GROUP BY p.idProcedimento, p.tipo " +
                "ORDER BY totalAgendamentos ASC"
    )
    fun findProcedimentoMenosAgendado(): List<Map<String, Any>>

    @Query(
        "SELECT p.idProcedimento AS idProcedimento, p.tipo AS tipo, AVG(f.nota) AS mediaNotas " +
                "FROM Feedback f JOIN f.agendamento a JOIN a.procedimento p " +
                "GROUP BY p.idProcedimento, p.tipo " +
                "ORDER BY mediaNotas DESC"
    )
    fun findProcedimentoComMelhorNota(): List<Map<String, Any>>

    @Query(
        nativeQuery = true, value = """
            SELECT 
                COUNT(a.id_agendamento) AS quantidade_agendamentos
            FROM 
                procedimento p
            LEFT JOIN 
                agendamento a ON p.id_procedimento = a.fk_procedimento
            GROUP BY 
                p.id_procedimento
        """
    )
    fun findQuantidadeAgendamentosPorProcedimento(): List<Int>

    @Query(
        nativeQuery = true, value = """
        SELECT 
            p.tipo AS tipo_procedimento
        FROM 
            procedimento p
        INNER JOIN 
            especificacao ep ON p.id_procedimento = ep.fk_procedimento
        INNER JOIN 
            agendamento a ON p.id_procedimento = a.fk_procedimento
        INNER JOIN 
            feedback f ON a.id_agendamento = f.fk_agendamento
        GROUP BY 
            p.id_procedimento, p.tipo
        ORDER BY 
            AVG(f.nota) DESC
        LIMIT 3
    """
    )
    fun findProcedimentosBemAvaliados(): List<String>

    @Query("SELECT MAX(p.idProcedimento) FROM Procedimento p")
    fun findMaxId(): Int?

    @Query(
        value = """
    WITH ProcedimentosAgendados AS (
        SELECT 
            a.fk_usuario,
            p.id_procedimento,
            p.tipo AS tipo_procedimento,
            p.descricao AS descricao_procedimento,
            COUNT(a.id_agendamento) AS total_agendamentos,
            MAX(a.data_horario) AS data_horario -- Adiciona o campo data_horario
        FROM 
            agendamento a
        JOIN 
            procedimento p ON a.fk_procedimento = p.id_procedimento
        WHERE 
            a.fk_usuario = :idUsuario  -- Filtra por ID do usuário
        GROUP BY 
            a.fk_usuario, p.id_procedimento, p.tipo, p.descricao
    ),
    RankedProcedimentos AS (
        SELECT 
            fk_usuario,
            tipo_procedimento,
            descricao_procedimento,
            total_agendamentos,
            data_horario, -- Inclui o campo data_horario
            ROW_NUMBER() OVER (PARTITION BY fk_usuario ORDER BY total_agendamentos DESC) AS rn
        FROM 
            ProcedimentosAgendados
    )

    SELECT 
        fk_usuario,
        tipo_procedimento,
        descricao_procedimento,
        total_agendamentos,
        data_horario -- Inclui o campo data_horario na seleção final
    FROM 
        RankedProcedimentos
    WHERE 
        rn <= 3
    ORDER BY 
        total_agendamentos DESC, data_horario DESC -- Ordena por total de agendamentos e data mais recente
    """,
        nativeQuery = true
    )
    fun findTop3ProcedimentosByUsuario(@Param("idUsuario") idUsuario: Int): List<Any>



}

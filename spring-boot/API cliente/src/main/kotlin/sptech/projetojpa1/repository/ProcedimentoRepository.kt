package sptech.projetojpa1.repository

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import sptech.projetojpa1.dominio.Procedimento
import sptech.projetojpa1.dto.procedimento.ProcedimentoTipoDTO

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
            especificacao_procedimento ep ON p.id_procedimento = ep.fk_procedimento
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
}

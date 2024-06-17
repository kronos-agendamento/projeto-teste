package sptech.projetojpa1.repository

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import sptech.projetojpa1.dominio.Procedimento

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
}

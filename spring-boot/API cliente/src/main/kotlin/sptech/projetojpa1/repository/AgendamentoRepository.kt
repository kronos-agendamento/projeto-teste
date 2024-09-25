package sptech.projetojpa1.repository

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import sptech.projetojpa1.domain.Agendamento
import sptech.projetojpa1.domain.Usuario
import java.time.LocalDateTime

@Repository
interface AgendamentoRepository : JpaRepository<Agendamento, Int> {

    @Query("SELECT a FROM Agendamento a WHERE a.dataHorario = :dataHorario")
    fun findByDataHorario(@Param("dataHorario") dataHorario: LocalDateTime): List<Agendamento>

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
}



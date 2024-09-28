package sptech.projetojpa1.repository

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import sptech.projetojpa1.domain.Agendamento
import sptech.projetojpa1.domain.Usuario
import sptech.projetojpa1.dto.agendamento.AgendamentoDTO
import java.time.LocalDateTime

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

    @Query("""
SELECT new sptech.projetojpa1.dto.agendamento.AgendamentoDTO(
        u.nome, a.idAgendamento, a.usuario.id, a.dataHorario, a.tipoAgendamento, 
        p.tipo, e.especificacao
    )
    FROM Agendamento a
    JOIN a.usuario u
    JOIN a.procedimento p
    JOIN a.especificacao e
    WHERE a.usuario.id = :usuarioId
    ORDER BY a.dataHorario DESC
    """)
    fun listarAgendamentosPorUsuario(usuarioId: Int): List<AgendamentoDTO>
}

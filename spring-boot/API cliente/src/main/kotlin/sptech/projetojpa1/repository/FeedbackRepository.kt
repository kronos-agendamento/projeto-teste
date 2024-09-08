package sptech.projetojpa1.repository

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import sptech.projetojpa1.domain.Feedback
import sptech.projetojpa1.domain.usuario.Cliente
import sptech.projetojpa1.dominio.Usuario

@Repository
interface FeedbackRepository : JpaRepository<Feedback, Int> {

    @Query(
        nativeQuery = true, value = """
        SELECT
            AVG(f.nota) AS media_nota
        FROM
            procedimento p
        INNER JOIN
            especificacao_procedimento ep ON p.id_procedimento = ep.fk_procedimento
        INNER JOIN
            agendamento a ON p.id_procedimento = a.fk_procedimento
        INNER JOIN
            feedback f ON a.id_agendamento = f.fk_agendamento
        GROUP BY
            p.id_procedimento
        ORDER BY
            AVG(f.nota) DESC
        LIMIT 3
    """
    )
    fun buscarMediaNotas(): List<Double>

    fun findAllByClienteAvaliado(cliente: Cliente): List<Feedback>
}
{
    fun deleteAllByUsuario(usuario: Usuario)
}
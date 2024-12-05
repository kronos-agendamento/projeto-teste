package sptech.projetojpa1.repository

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import sptech.projetojpa1.domain.Feedback
import sptech.projetojpa1.domain.usuario.Cliente
import sptech.projetojpa1.domain.Usuario

@Repository
interface FeedbackRepository : JpaRepository<Feedback, Int> {

    @Query(
        nativeQuery = true, value = """
        SELECT 
            AVG(f.nota) AS media_nota_geral
        FROM 
            feedback f
        INNER JOIN 
            agendamento a ON f.fk_agendamento = a.id_agendamento
        WHERE 
            a.data_horario BETWEEN COALESCE(:startDate, DATE_SUB(CURDATE(), INTERVAL 1 MONTH)) 
                              AND COALESCE(:endDate, CURDATE())
    """
    )
    fun buscarMediaNotaGeral(
        @Param("startDate") startDate: String?,
        @Param("endDate") endDate: String?
    ): Double?









    fun findAllByClienteAvaliado(cliente: Cliente): List<Feedback>

    fun deleteAllByUsuario(usuario: Usuario)

    fun findAllByUsuario(usuario: Usuario): List<Feedback>
}
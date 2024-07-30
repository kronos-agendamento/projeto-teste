package sptech.projetojpa1.repository

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import sptech.projetojpa1.dominio.Agendamento
import java.util.*

@Repository
interface AgendamentoRepository : JpaRepository<Agendamento, Int> {

    @Query("SELECT a FROM Agendamento a WHERE a.dataHorario = :dataHorario")
    fun findByDataHorario(@Param("dataHorario") dataHorario: Date): List<Agendamento>

}

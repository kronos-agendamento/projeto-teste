package sptech.projetojpa1.repository

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import sptech.projetojpa1.dominio.Agendamento
import sptech.projetojpa1.dominio.Procedimento
import java.util.*

@Repository
interface AgendamentoRepository : JpaRepository<Agendamento, Int> {

    @Query("SELECT a FROM Agendamento a WHERE a.data = :data AND a.horario = :horario")
    fun findByDataAndHorario(@Param("data") data: Date, @Param("horario") horario: Date): List<Agendamento>

}


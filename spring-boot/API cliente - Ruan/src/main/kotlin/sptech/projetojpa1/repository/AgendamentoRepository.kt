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

    // No AgendamentoRepository.kt
    fun findMostScheduledProcedure(): Procedimento {
        // Implemente a consulta para obter o procedimento mais agendado nos últimos 3 meses
    }

    fun findLeastScheduledProcedure(): Procedimento {
        // Implemente a consulta para obter o procedimento menos agendado nos últimos 3 meses
    }

    fun findBestRatedProcedure(): Procedimento {
        // Implemente a consulta para obter o procedimento melhor avaliado nos últimos 3 meses
    }
}


package sptech.projetojpa1.dominio

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import java.sql.Time
import java.time.LocalTime

@Entity
class HorarioFuncionamento(
    // Código do horário de funcionamento
    @field:Id @field:GeneratedValue(strategy = GenerationType.IDENTITY) var codigo: Int,
    // Dia da semana
    var diaSemana: String,
    // Horário de abertura
    var horarioAbertura: String,
    // Horário de fechamento
    var horarioFechamento: String
)
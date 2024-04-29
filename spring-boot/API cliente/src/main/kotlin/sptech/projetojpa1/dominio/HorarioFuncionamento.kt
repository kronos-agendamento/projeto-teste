package sptech.projetojpa1.dominio

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import java.sql.Time

@Entity
class HorarioFuncionamento (
    @field:Id @field:GeneratedValue(strategy = GenerationType.IDENTITY) var codigo:Int,
    var diaSemana:String,
    var horarioAbertura:Time,
    var horarioFechamento:Time
){
}
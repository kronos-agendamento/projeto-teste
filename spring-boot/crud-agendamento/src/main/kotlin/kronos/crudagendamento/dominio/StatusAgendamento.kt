package kronos.crudagendamento.dominio

import jakarta.persistence.Column
import jakarta.persistence.Id

data class StatusAgendamento(
    @field:Id val Id:Int,
    @Column(name="andamento") var andamento:String,
    @Column(name="motivo") var motivo:String
    ) {
}
package kronos.crudagendamento.dominio

import jakarta.persistence.*
import org.springframework.format.annotation.DateTimeFormat
import java.sql.Date

@Entity
data class Agendamento(

    @field:Id @GeneratedValue(strategy = GenerationType.IDENTITY) var idAgendamento:Int,
    @field:Temporal(TemporalType.TIMESTAMP) @Column(name="data_hora") var dataHora:Date,
    @Column (name= "tipo_agendamento")var tipoAgendamento:Int,
    @Column(name= "fk_tipo_servico")var fkTipoServico:Int,

    @ManyToOne
    @JoinColumn(name="fk_usuario")
    var usuario:Usuario,

    @ManyToOne
    @JoinColumn(name="fk_status")
    var status:StatusAgendamento
) {


}
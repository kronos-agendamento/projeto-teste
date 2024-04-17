package sptech.projetojpa1.dominio

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.ManyToOne
import jakarta.validation.constraints.Future
import java.time.LocalDateTime

@Entity
class Ficha (
    @field:Id @field:GeneratedValue(strategy = GenerationType.IDENTITY)
    var codigoAnamneseMicro:Int?,
    @field:Future var dataMarcada:LocalDateTime,
    @field:ManyToOne var cliente: Cliente?,
    @field:ManyToOne var parteCorpo: ParteCorpo?,
    @field:ManyToOne var direcaoDormir:Direcao?,
    @field:ManyToOne var gestante: SituacaoGestante?,
    @field:ManyToOne var tratamento:Tratamento?,
    @field:ManyToOne var doenca:Doenca?
) {
}
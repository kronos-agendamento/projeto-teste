package sptech.projetojpa1.dominio

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import java.time.LocalDate

@Entity
data class Musica(
    // Id é do pacote jakarta.persistence
    @field:Id @field:GeneratedValue(strategy = GenerationType.IDENTITY)
    var codigo:Int?,
    var nome:String?,
    var totalOuvintes:Int?,
    var lancamento:LocalDate?,
    var classico: Boolean?,
    var estilo:String?
)

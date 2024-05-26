package sptech.projetojpa1.dominio

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "fichaAnamnese")
class FichaAnamnese(
    // Código da ficha de anamnese
    @field:Id @field:GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_ficha_anamnese")
    var codigoFicha: Int?,
    // Data de preenchimento da ficha de anamnese
    var dataPreenchimento: LocalDateTime
)
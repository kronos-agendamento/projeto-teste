package sptech.projetojpa1.dominio

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.ManyToOne

@Entity
class Resposta(
    @field:Id @field:GeneratedValue(strategy = GenerationType.IDENTITY)
    var codigoRespostaFichaUsuario: Int? = null,
    var resposta: String,
    @field:ManyToOne var pergunta: Pergunta,
    @field:ManyToOne var ficha: FichaAnamnese,
    @field:ManyToOne var usuario: Usuario
)
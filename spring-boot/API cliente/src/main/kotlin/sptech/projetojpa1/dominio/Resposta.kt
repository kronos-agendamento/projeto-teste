package sptech.projetojpa1.dominio

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.ManyToOne

@Entity
class Resposta(
    // Código da resposta da ficha do usuário
    @field:Id @field:GeneratedValue(strategy = GenerationType.IDENTITY) var codigoRespostaFichaUsuario: Int? = null,
    // Resposta
    var resposta: String,
    // Pergunta associada à resposta
    @field:ManyToOne var pergunta: Pergunta,
    // Ficha de anamnese associada à resposta
    @field:ManyToOne var ficha: FichaAnamnese,
    // Usuário associado à resposta
    @field:ManyToOne var usuario: Usuario
)
package sptech.projetojpa1.dominio

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne

@Entity
class Resposta(
    // Código da resposta da ficha do usuário
    @field:Id @field:GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_resposta")
    var codigoRespostaFichaUsuario: Int? = null,
    // Resposta
    @Column(name="resposta_cliente")
    var resposta: String,
    // Pergunta associada à resposta
    @field:ManyToOne
    @JoinColumn(name="fk_pergunta")
    var pergunta: Pergunta,
    // Ficha de anamnese associada à resposta
    @field:ManyToOne
    @JoinColumn(name="fk_ficha")
    var ficha: FichaAnamnese,
    // Usuário associado à resposta
    @field:ManyToOne
    @JoinColumn(name="fk_usuario")
    var usuario: Usuario
)
package sptech.projetojpa1.domain

import jakarta.persistence.*

@Entity
@Table(name = "resposta")
class Resposta(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_resposta")
    var idResposta: Int? = null,

    @Column(name = "resposta", nullable = false)
    var resposta: String,

    @ManyToOne
    @JoinColumn(name = "fk_pergunta", nullable = false)
    var pergunta: Pergunta,

    @ManyToOne
    @JoinColumn(name = "fk_ficha_anamnese", nullable = false)
    var fichaAnamnese: FichaAnamnese,

    @ManyToOne
    @JoinColumn(name = "fk_usuario", nullable = false)
    var usuario: Usuario
)
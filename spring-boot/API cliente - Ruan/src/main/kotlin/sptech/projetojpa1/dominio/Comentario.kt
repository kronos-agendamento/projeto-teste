package sptech.projetojpa1.dominio

import jakarta.persistence.*

@Entity
@Table(name = "comentario")
data class Comentario(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_comentario")
    var id: Int?,

    @Column(name = "texto", nullable = false)
    var texto: String,

    @Column(name = "curtidas", nullable = false)
    var curtidas: Int = 0,

    @ManyToOne
    @JoinColumn(name = "id_publicacao")
    var publicacao: Publicacao,

    @ManyToOne
    @JoinColumn(name = "id_usuario")
    var usuario: Usuario
)
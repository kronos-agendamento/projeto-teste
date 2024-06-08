package sptech.projetojpa1.dominio

import jakarta.persistence.*

@Entity
@Table(name = "publicacao")
data class Publicacao(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_publicacao")
    var id: Int?,

    @Column(name = "titulo", nullable = false)
    var titulo: String,

    @Column(name = "legenda")
    var legenda: String?,

    @Column(name = "foto")
    var foto: String?,

    @Column(name = "curtidas", nullable = false)
    var curtidas: Int = 0,

    @ManyToOne
    @JoinColumn(name = "id_usuario")
    var usuario: Usuario
)
package sptech.projetojpa1.dominio

import jakarta.persistence.*


@Entity
data class Item(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int = 0,
    @ManyToOne
    @JoinColumn(name = "pacote_id")
    val pacote: Pacote,
    val servico: Int,
    val quantidade: Int
)

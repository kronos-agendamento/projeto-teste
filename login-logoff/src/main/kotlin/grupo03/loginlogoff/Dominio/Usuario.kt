package grupo03.loginlogoff.Dominio

import jakarta.persistence.*

@Entity
data class Usuario(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long?,

    @Column(nullable = false)
    val email: String,

    @Column(nullable = false)
    val senha: String,

    @Column(nullable = false)
    var status: String = "inativo"
)

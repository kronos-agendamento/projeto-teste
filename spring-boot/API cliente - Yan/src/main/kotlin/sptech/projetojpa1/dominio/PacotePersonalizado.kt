package sptech.projetojpa1.dominio

import jakarta.persistence.*
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import sptech.projetojpa1.dominio.Procedimento
import sptech.projetojpa1.dominio.Usuario



data class PacotePersonalizado(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int? = null,

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    val usuario: Usuario,

    val mes: Int,

    @ManyToMany // Assuming ManyToMany relationship for this example
    @JoinTable(
        name = "pacote_procedimento",
        joinColumns = [JoinColumn(name = "pacote_id")],
        inverseJoinColumns = [JoinColumn(name = "procedimento_id")]
    )
    val procedimentos: List<Procedimento>,

    val descontoProcedimento: Double
)

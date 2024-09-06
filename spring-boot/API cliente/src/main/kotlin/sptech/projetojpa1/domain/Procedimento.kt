package sptech.projetojpa1.domain

import jakarta.persistence.*
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size

@Entity
@Table(name = "procedimento")
open class Procedimento(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_procedimento")
    open var idProcedimento: Int? = null,  // Mark this property as open

    @field:NotNull(message = "O campo tipo não pode ser nulo")
    @field:Size(min = 1, max = 100, message = "O campo tipo deve ter entre 1 e 100 caracteres")
    @Column(name = "tipo")
    open var tipo: String?,  // Mark this property as open

    @field:NotNull(message = "O campo descrição não pode ser nulo")
    @field:Size(min = 1, max = 500, message = "O campo descrição deve ter entre 1 e 500 caracteres")
    @Column(name = "descricao")
    open var descricao: String?  // Mark this property as open
)

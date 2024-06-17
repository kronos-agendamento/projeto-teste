package sptech.projetojpa1.dominio

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.OneToMany
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull

@Entity
data class PacotePersonalizado(

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @NotNull @NotBlank
    val id:Int,
    val nome:String,
    val descontoProcedimento:Double,
    @OneToMany
    val procedimento: List<Procedimento>,
    @OneToMany
    val usuario:Usuario,
    val mes:Int,

) {
}
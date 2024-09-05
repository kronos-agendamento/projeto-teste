package sptech.projetojpa1.domain

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType

@Entity
@Table(name = "Procedimento")
open class Procedimento(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_procedimento")
    var idProcedimento: Int? = null,
    @field:NotNull(message = "O campo tipo não pode ser nulo")
    @field:Size(min = 1, max = 100, message = "O campo tipo deve ter entre 1 e 100 caracteres")
    var tipo: String?,

    @field:NotNull(message = "O campo descrição não pode ser nulo")
    @field:Size(min = 1, max = 500, message = "O campo descrição deve ter entre 1 e 500 caracteres")
    var descricao: String?,
) {
    override fun toString(): String {
        return "Procedimento(idProcedimento=$idProcedimento, tipo=$tipo, descricao=$descricao)"
    }
}
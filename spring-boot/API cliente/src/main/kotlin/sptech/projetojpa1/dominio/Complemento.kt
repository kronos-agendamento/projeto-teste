package sptech.projetojpa1.dominio

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.validation.constraints.NotBlank

@Entity
class Complemento(
    @field:Id @field:GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_complemento")
    var codigo: Int?,

    @field:NotBlank(message = "Complemento é obrigatório") var complemento: String?,
    @field:ManyToOne
    @JoinColumn(name = "fk_endereco")
    var endereco: Endereco?
)
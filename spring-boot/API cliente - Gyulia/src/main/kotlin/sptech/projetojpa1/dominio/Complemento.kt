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
    // Código do complemento
    @field:Id @field:GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_complemento")
    var codigo: Int?,
    // Descrição do complemento
    @field:NotBlank(message = "Complemento é obrigatório") var complemento: String?,
    // Endereço associado ao complemento
    @field:ManyToOne
    @JoinColumn(name = "endereco_codigo")
    var endereco: Endereco?
)
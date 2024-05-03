package sptech.projetojpa1.dominio

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.ManyToOne
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size

@Entity
data class Endereco(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) var codigo: Int?,
    @field:NotBlank var logradouro: String,
    @field:NotBlank @Size(max = 10) var cep: String,
    @field:NotNull var numero: Int,
    var bairro: String?,
    var cidade: String?,
    var estado: String?,
    @ManyToOne var complemento: Complemento?,
    @ManyToOne var usuario: Usuario?
)

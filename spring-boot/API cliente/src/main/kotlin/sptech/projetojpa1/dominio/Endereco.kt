package sptech.projetojpa1.dominio

import jakarta.persistence.*
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size

@Entity
data class Endereco(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_endereco")
    var codigo: Int?,

    @field:NotBlank(message = "Logradouro é obrigatório") var logradouro: String,
    @field:NotBlank(message = "CEP é obrigatório") @field:Size(
        max = 8,
        message = "CEP deve ter no máximo 8 caracteres"
    )
    var cep: String,

    var bairro: String?,

    var cidade: String?,

    var estado: String?,

    var numero: Int?,

    var complemento: String?
)
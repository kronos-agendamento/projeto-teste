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
    // Código do endereço
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) var codigo: Int?,
    // Logradouro do endereço
    @field:NotBlank(message = "Logradouro é obrigatório") var logradouro: String,
    // CEP do endereço
    @field:NotBlank(message = "CEP é obrigatório") @field:Size(
        max = 10,
        message = "CEP deve ter no máximo 10 caracteres"
    ) var cep: String,
    // Número do endereço
    @field:NotNull(message = "Número é obrigatório") var numero: Int,
    // Bairro do endereço
    var bairro: String?,
    // Cidade do endereço
    var cidade: String?,
    // Estado do endereço
    var estado: String?,
    // Complemento associado ao endereço
    @ManyToOne var complemento: Complemento?,
    // Usuário associado ao endereço
    @ManyToOne var usuario: Usuario?
)
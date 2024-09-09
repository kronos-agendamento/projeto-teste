package sptech.projetojpa1.domain

import com.fasterxml.jackson.annotation.JsonBackReference
import jakarta.persistence.*
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size

@Entity
@Table(name = "endereco")
class Endereco(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_endereco")
    val idEndereco: Int? = null,

    @field:NotBlank(message = "Logradouro é obrigatório")
    @Column(name = "logradouro")
    var logradouro: String,

    @field:NotBlank(message = "CEP é obrigatório")
    @field:Size(max = 8, message = "CEP deve ter no máximo 8 caracteres")
    @Column(name = "cep")
    var cep: String,

    @field:NotBlank(message = "Bairro é obrigatório")
    @Column(name = "bairro")
    var bairro: String,

    @field:NotBlank(message = "Cidade é obrigatória")
    @Column(name = "cidade")
    var cidade: String,

    @field:NotBlank(message = "Estado é obrigatório")
    @Column(name = "estado")
    var estado: String,

    @field:NotNull(message = "Número é obrigatório")
    @Column(name = "numero")
    var numero: String,

    @field:Size(max = 100, message = "Complemento deve ter no máximo 100 caracteres")
    @Column(name = "complemento")
    var complemento: String? = null,
)
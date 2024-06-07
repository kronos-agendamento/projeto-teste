package sptech.projetojpa1.dominio

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull

@Entity
class NivelAcesso(
    // Código do nível de acesso
    @field:Id @field:GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_nivel_acesso")
    var codigo: Int?,
    // Nome do nível de acesso
    @field:NotBlank(message = "Nome é obrigatório") var nome: String?,
    // Nível do acesso
    @field:NotNull(message = "Nível é obrigatório") var nivel: Int?,
    // Descrição do nível de acesso
    @field:NotBlank(message = "Descrição é obrigatória") var descricao: String?
)

package sptech.projetojpa1.domain

import jakarta.persistence.*
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull

@Entity
@Table(name = "nivel_acesso")
class NivelAcesso(
    @field:Id @field:GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_nivel_acesso")
    var codigo: Int?,

    @field:NotBlank(message = "Nome é obrigatório")
    var nome: String?,

    @field:NotNull(message = "Nível é obrigatório")
    var nivel: Int?,

    @field:NotBlank(message = "Descrição é obrigatória")
    var descricao: String?
)
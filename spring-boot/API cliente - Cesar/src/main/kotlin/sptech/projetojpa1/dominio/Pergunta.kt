package sptech.projetojpa1.dominio

import jakarta.persistence.*
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size
import org.jetbrains.annotations.NotNull

@Entity
@Table(name = "pergunta")
class Pergunta(
    // Código da pergunta
    @field:Id @field:GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pergunta")
    var codigoPergunta: Int,
    // Descrição da pergunta
    @field:NotBlank(message = "Descrição é obrigatória")
    @field:Size(max = 70, message = "A descrição do procedimento deve ter no máximo 70 caracteres")
    var descricao: String,

    @field:NotBlank(message = "Tipo é obrigatório")
    var tipo: String,
    // Status da pergunta
    var status: Boolean = false
)
package sptech.projetojpa1.dominio

import jakarta.persistence.*
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

@Entity
@Table(name = "procedimento")
data class Procedimento(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_procedimento")
    var id: Int? = null,

    // Anotação para garantir que o tipo do procedimento não seja vazio
    @field:NotBlank(message = "O tipo do procedimento não pode estar em branco")
    // Anotação para limitar o tamanho máximo do tipo do procedimento a 100 caracteres
    //@field:Size(max = 100, message = "O tipo do procedimento deve ter no máximo 100 caracteres")
    //var tipo: String? = null,

    // Anotação para garantir que a descrição do procedimento não seja vazia
    @field:NotBlank(message = "A descrição do procedimento não pode estar em branco")
    var descricao: String? = null
)

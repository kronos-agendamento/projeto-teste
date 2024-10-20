package sptech.projetojpa1.domain

import jakarta.persistence.*
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Null
import jakarta.validation.constraints.Size

@Entity
@Table(name = "pergunta")
class Pergunta(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pergunta")
    var idPergunta: Int? = null,

    @Column(name = "pergunta")
    @field:NotBlank(message = "Tipo é obrigatório")
    var pergunta: String,

    @Column(name = "pergunta_ativa")
    var ativa: Boolean? = null,

    @Column(name = "pergunta_tipo")
    var tipo:String? = null
)
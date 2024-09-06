package sptech.projetojpa1.domain

import jakarta.persistence.*
import jakarta.validation.constraints.NotBlank

@Entity
@Table(name = "mensagem")
data class Mensagem (
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) @Column(name = "id_mensagem")
    var id: Int?,

    @Column(name = "descricao", length = 100) @NotBlank(message = "Descrição é obrigatória")
    var descricao: String?,

)
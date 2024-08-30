package sptech.projetojpa1.domain

import jakarta.persistence.*
import jakarta.validation.constraints.NotBlank

@Entity
@Table(name = "status_agendamento")
data class Status(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) @Column(name = "id_status_agendamento")
    var id: Int?,

    @Column(name = "nome", length = 30) @NotBlank(message = "Descrição é obrigatória")
    var nome: String?,

    @Column(name = "cor", length = 200)
    var cor: String?,

    @Column(name = "motivo", length = 200)
    var motivo: String?
) {
    override fun toString(): String {
        return "Status(id=$id, nome=$nome, cor=$cor, motivo=$motivo)"
    }
}
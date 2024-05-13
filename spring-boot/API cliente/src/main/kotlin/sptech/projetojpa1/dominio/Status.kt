package sptech.projetojpa1.dominio

import jakarta.persistence.*
import jakarta.validation.constraints.NotBlank

@Entity
@Table(name = "statusAgendamento")
data class Status(
    // ID do status de agendamento
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) @Column(name = "id_status_agendamento") var id: Int?,
    // Descrição do status
    @Column(name = "nome", length = 30) @NotBlank(message = "Descrição é obrigatória") var nome: String?,
    @Column(name = "cor", length = 200) var cor: String?,
    @Column(name = "motivo", length = 200) var motivo: String?
)
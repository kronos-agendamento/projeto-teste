package sptech.projetojpa3.dominio
import com.fasterxml.jackson.annotation.JsonIgnore
import jakarta.persistence.*
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size
import java.time.LocalDate

@Entity
@Table(name = "statusAgendamento")
data class Status(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_status_agendamento")
    var id: Int?,

    @Column(name = "descricao", length = 30)
    @NotBlank
    var descricao: String?,

    @Column(name = "motivo", length = 200)
    var motivo: String?
)


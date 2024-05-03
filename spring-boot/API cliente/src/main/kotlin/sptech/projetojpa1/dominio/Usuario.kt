package sptech.projetojpa1.dominio

import com.fasterxml.jackson.annotation.JsonIgnore
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.ManyToOne
import jakarta.validation.constraints.*
import org.hibernate.validator.constraints.br.CPF
import java.time.LocalDate

@Entity
data class Usuario(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) var codigo: Int?,
    @field:NotBlank var nome: String?,
    @field:NotBlank @Email var email: String?,
    @field:NotBlank var senha: String?,
    @field:NotBlank var instagram: String?,
    @field:CPF var cpf: String?,
    @field:NotNull var telefone: Long,
    @field:NotNull var telefoneEmergencial: Long,
    @field:Past var dataNasc: LocalDate?,
    @field:NotBlank var genero: String?,
    var indicacao: String?,
    @JsonIgnore @Column(length = 30 * 1024 * 1024) var foto: ByteArray?,
    var status: Boolean = true,
    @ManyToOne var nivelAcesso: NivelAcesso?,
    @ManyToOne var endereco: Endereco?,
    @ManyToOne var empresa: Empresa?,
    @ManyToOne var fichaAnamnese: FichaAnamnese?
)

package sptech.projetojpa1.domain

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "FichaAnamnese")
class FichaAnamnese(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_ficha")
    var codigoFicha: Int? = null,

    var dataPreenchimento: LocalDateTime,

    @OneToOne(mappedBy = "fichaAnamnese")
    var usuario: Usuario? = null,

    @OneToMany(mappedBy = "fichaAnamnese", cascade = [CascadeType.ALL], fetch = FetchType.LAZY)
    var respostas: List<Resposta> = mutableListOf()
) {
    override fun toString(): String {
        return "FichaAnamnese(codigoFicha=$codigoFicha, dataPreenchimento=$dataPreenchimento, usuario=$usuario, respostas=$respostas)"
    }
}
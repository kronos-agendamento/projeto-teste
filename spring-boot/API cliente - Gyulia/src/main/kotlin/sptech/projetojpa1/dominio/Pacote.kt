package sptech.projetojpa1.dominio

import jakarta.persistence.*

//
//@Entity
//@Table(name = "sptech/projetojpa1/dto/pacote")
//data class Pacote(
//    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @Column(name = "id_pacote")
//    val idPacote: Int? = null,
//
//    @field:NotBlank(message = "Nome do pacote é obrigatório")
//    @field:Size(max = 100, message = "O nome do pacote deve ter no máximo 100 caracteres")
//    var nome: String,
//
//    @field:PositiveOrZero(message = "O desconto deve ser positivo ou zero")
//    var descontoColocacao: Double = 0.0,
//
//    @field:PositiveOrZero(message = "O desconto deve ser positivo ou zero")
//    val descontoManutencao: Double = 0.0,
//
//    @OneToMany
//    var procedimentos: List<Especificacao>? = null
//)
//
@Entity
data class Pacote(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int = 0,
    var nome: String,
    val itens: Int? = null,
    var descontoColocacao: Double,
    var descontoManutencao: Double
)
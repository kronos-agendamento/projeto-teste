package sptech.projetojpa1.dominio

import jakarta.persistence.*

@Entity
@Table(name = "avaliador")
@Inheritance(strategy = InheritanceType.JOINED)
abstract class Avaliador(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_avaliador")
    var codigo: Int? = null,

    @Column(name = "nome")
    var nome: String? = null,

    @Column(name = "email")
    var email: String? = null,

    @Column(name = "senha")
    var senha: String? = null,

    @Column(name = "instagram")
    var instagram: String? = null
) {
    override fun toString(): String {
        return "Avaliador(codigo=$codigo, nome=$nome, email=$email, instagram=$instagram)"
    }
}
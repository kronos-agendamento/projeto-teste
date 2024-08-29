package sptech.projetojpa1.dominio.usuario

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Table
import sptech.projetojpa1.dominio.Usuario

@Entity
@Table(name = "profissional")
class Profissional(
    codigo: Int? = null,
    nome: String? = null,
    email: String? = null,
    senha: String? = null,
    instagram: String? = null,

    @Column(name = "numero_avaliacoes")
    var numeroAvaliacoes: Int? = null,

    @Column(name = "media_nota")
    var mediaNota: Double? = null,

    @Column(name = "qualificacoes")
    var qualificacoes: String? = null,

    @Column(name = "especialidade")
    var especialidade: String? = null
) : Usuario(codigo, nome, email, instagram) {
    override fun toString(): String {
        return "Profissional(codigo=$codigo, nome=$nome, email=$email, instagram=$instagram, numeroAvaliacoes=$numeroAvaliacoes, mediaNota=$mediaNota, qualificacoes=$qualificacoes, especialidade=$especialidade)"
    }
}
package sptech.projetojpa1.domain.usuario

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Table
import sptech.projetojpa1.domain.Usuario

@Entity
@Table(name = "cliente")
class Cliente(
    codigo: Int? = null,
    nome: String? = null,
    email: String? = null,
    senha: String? = null,
    instagram: String? = null,

    @Column(name = "experiencia_avaliada")
    var experienciaAvaliada: String? = null,

    @Column(name = "frequencia")
    var frequencia: Int? = null
) : Usuario(codigo, nome, email, instagram) {
    override fun toString(): String {
        return "Cliente(codigo=$codigo, nome=$nome, email=$email, instagram=$instagram, experienciaAvaliada=$experienciaAvaliada, frequencia=$frequencia)"
    }
}
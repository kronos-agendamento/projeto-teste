package sptech.projetojpa1.dominio.servico

import jakarta.persistence.Entity
import jakarta.persistence.Table
import sptech.projetojpa1.dominio.Servico

@Entity
@Table(name = "make")
class Make(
    nome: String,
    descricao: String
) : Servico(nome = nome, descricao = descricao) {
    override fun descricaoCompleta(): String? {
        return "Make: $descricao"
    }
}
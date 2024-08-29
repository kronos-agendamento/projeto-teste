package sptech.projetojpa1.domain.servico

import jakarta.persistence.Entity
import jakarta.persistence.Table
import sptech.projetojpa1.domain.Servico

@Entity
@Table(name = "sobrancelha")
class Sobrancelha(
    nome: String,
    descricao: String
) : Servico(nome = nome, descricao = descricao) {
    override fun descricaoCompleta(): String? {
        return "Sobrancelha: $descricao"
    }
}
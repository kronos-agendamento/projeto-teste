package sptech.projetojpa1.domain.usuario

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Table
import sptech.projetojpa1.domain.*
import java.time.LocalDate

@Entity
@Table(name = "profissional")
class Profissional(
    codigo: Int? = null,
    nome: String? = null,
    email: String? = null,
    senha: String? = null,
    instagram: String? = null,
    cpf: String? = null,
    telefone: Long? = null,
    dataNasc: LocalDate? = null,
    genero: String? = null,
    indicacao: String? = null,
    foto: ByteArray? = null,
    status: Boolean? = true,
    nivelAcesso: NivelAcesso? = null,
    endereco: Endereco? = null,
    empresa: Empresa? = null,
    @Column(name = "numero_avaliacoes")
    var numeroAvaliacoes: Int? = null,
    @Column(name = "media_nota")
    var mediaNota: Double? = null,
    @Column(name = "qualificacoes")
    var qualificacoes: String? = null,
    @Column(name = "especialidade")
    var especialidade: String? = null
) : Usuario(
    codigo,
    nome,
    email,
    senha,
    instagram,
    cpf,
    telefone,
    dataNasc,
    genero,
    indicacao,
    foto,
    status,
    nivelAcesso,
    endereco,
    empresa,
) {
    override fun toString(): String {
        return "Profissional(codigo=$codigo, nome=$nome, email=$email, instagram=$instagram, numeroAvaliacoes=$numeroAvaliacoes, mediaNota=$mediaNota, qualificacoes=$qualificacoes, especialidade=$especialidade)"
    }
}
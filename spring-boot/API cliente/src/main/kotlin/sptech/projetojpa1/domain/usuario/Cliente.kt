package sptech.projetojpa1.domain.usuario

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Table
import sptech.projetojpa1.domain.*
import java.time.LocalDate

@Entity
@Table(name = "cliente")
class Cliente(
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
    fichaAnamnese: FichaAnamnese? = null,
    @Column(name = "experiencia_avaliada")
    var experienciaAvaliada: String? = null,
    @Column(name = "frequencia")
    var frequencia: Int? = null
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
    fichaAnamnese
) {
    override fun toString(): String {
        return "Cliente(codigo=$codigo, nome=$nome, email=$email, instagram=$instagram, experienciaAvaliada=$experienciaAvaliada, frequencia=$frequencia)"
    }
}
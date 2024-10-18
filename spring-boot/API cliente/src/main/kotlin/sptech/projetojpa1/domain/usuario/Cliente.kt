package sptech.projetojpa1.domain.usuario

import jakarta.persistence.Column
import jakarta.persistence.DiscriminatorValue
import jakarta.persistence.Entity
import jakarta.validation.constraints.Pattern
import sptech.projetojpa1.domain.*
import java.time.LocalDate

@Entity
@DiscriminatorValue("Cliente")
class Cliente(
    codigo: Int,
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
)
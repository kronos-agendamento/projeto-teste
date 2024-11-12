package sptech.projetojpa1.domain.usuario

import jakarta.persistence.Column
import jakarta.persistence.DiscriminatorValue
import jakarta.persistence.Entity
import jakarta.validation.constraints.Pattern
import sptech.projetojpa1.domain.*
import java.time.LocalDate

@Entity
@DiscriminatorValue("Profissional")
class Profissional(
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
    avaliacao: Int? = null,  // <-- Adicione aqui para alinhar ao parâmetro esperado
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
    avaliacao, // <-- Passa o parâmetro avaliacao explicitamente para corresponder ao tipo
    status,
    nivelAcesso,
    endereco,
    empresa,
)

package kronos.projetoplenitutenoolhar.usuario

import java.time.LocalDateTime
import java.util.Date

class Usuario (
    var senha: String,
    var nome: String,
    var email: String,
    var telefone: String,
    var instagram: String,
    var rg: String,
    var cpf: String,
    var data_nasc: Date,
    var gestante: Int,
    var genero: Int,
    var indicacao: String,
    ) {
}
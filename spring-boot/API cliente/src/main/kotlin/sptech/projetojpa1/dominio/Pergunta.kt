package sptech.projetojpa1.dominio

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.ManyToOne
import org.jetbrains.annotations.NotNull

@Entity
class Pergunta (
    @field:Id @field:GeneratedValue(strategy = GenerationType.IDENTITY)
    var codigoPergunta: Int,
    var descricao:String,
    var tipo:String,

    var status: Boolean = false


//    -> CLASSE Pergunta:
//- falta o atributo status, ativada ou desativada.

) {
}
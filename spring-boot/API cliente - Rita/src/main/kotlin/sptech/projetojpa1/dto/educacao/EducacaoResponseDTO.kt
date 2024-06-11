package sptech.projetojpa1.dto.educacao

import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.validation.constraints.NotNull
import sptech.projetojpa1.dominio.Status

class EducacaoResponseDTO (
    val idEducacao:Int,
    val nome:String,
    val descricao:String,
    val nivel:String,
    val modalidade:String,
    val cargaHoraria:String,
    val precoEducacao:Double,
    var ativo: Boolean = true

) {
}
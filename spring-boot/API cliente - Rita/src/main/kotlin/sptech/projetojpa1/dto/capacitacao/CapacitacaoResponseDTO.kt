package sptech.projetojpa1.dto.capacitacao

class CapacitacaoResponseDTO (
    val idCapacitacao:Int,
    val nome:String,
    val descricao:String,
    val nivel:String,
    val modalidade:String,
    val cargaHoraria:String,
    val precoCapacitacao:Double,
    var ativo: Boolean = true

) {
}
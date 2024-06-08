package sptech.projetojpa1.dto.procedimento

import sptech.projetojpa1.dominio.Promocao

data class ProcedimentoDTO(
    val idProcedimento: Int,
    val tipo: String?,
    val descricao: String?,
    val promocao: Promocao?
)

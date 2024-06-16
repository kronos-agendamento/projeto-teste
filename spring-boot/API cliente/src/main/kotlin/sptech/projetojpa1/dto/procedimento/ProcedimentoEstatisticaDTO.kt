package sptech.projetojpa1.dto.procedimento

data class ProcedimentoEstatisticaDTO(
    val idProcedimento: Int,
    val tipo: String,
    val totalAgendamentos: Long? = null,
    val mediaNotas: Double? = null
)

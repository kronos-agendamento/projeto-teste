package kronos.projetoplenitutenoolhar.agendamento

import java.time.LocalDateTime

data class AtualizarAgendamento (
    var novaData: LocalDateTime,
    var novoServico: String,
    var novoTpServico: String,
    var novoEsteticista: String,
    var novoCliente: String,
) {

}
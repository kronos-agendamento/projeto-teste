package kronos.projetoplenitutenoolhar.agendamento

import java.time.LocalDateTime

class Agendamento ( // Essas são as informações da classe de AGENDAMENTOOOOOOOO
    var data: LocalDateTime = LocalDateTime.now(),
    var servico: String,
    var tpServico: String,
    var cliente: String,
    var esteticista: String,
){

}
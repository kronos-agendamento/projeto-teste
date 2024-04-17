package kronos.projetoplenitutenoolhar.agendamento

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.time.LocalDateTime

@RestController
@RequestMapping("/agendamentos")
class agendamentoController(agendamentoRepository:AgendamentoRepository) {
    fun existeAgendamento(indice: Int): Boolean {
        return indice >= 0 && indice < listaAgendamentos.size
    }

    @PostMapping
    fun criar(@RequestBody novoAgendamento:Agendamento):ResponseEntity<Agendamento>{
        var agendamentoSalvo = agendamentoRepository.save(novoAgendamento)
        if(agendamentoSalvo.isEmpty()){
            return ResponseEntity.status(204).build()
        }
        return ResponseEntity.status(200).body(agendamentoSalvo)
    }

    @GetMapping
    fun exibirAgendamento():ResponseEntity<List<Agendamento>>{
        val listaAgendamento = agendamentoRepository.findAll()
        if(listaAgendamento.isEmpty()){
            return ResponseEntity.status(204).build()
        }
        return ResponseEntity.status(200).body(listaAgendamento)
    }

    @DeleteMapping("/{codigo}")
    fun deletar(@PathVariable codigo:Int):ResponseEntityt<Void>{
        if(agendamentoRepository.existsById(codigo)){
            agendamentoRepository.delete(codigo)
            return ResponseEntity.status(204).build
        }
        return ResponseEntity.status(404).build()
    }

    @GetMapping("/{indice}")
    fun buscarAgendamento(@PathVariable indice:Int): ResponseEntity<Agendamento> {
        try {
            return ResponseEntity.status(200).body(listaAgendamentos[indice])
        } catch (exception:Exception) {
            return ResponseEntity.status(404).build()
        }
    }

    @PutMapping("/{indice}")
    fun atualizarMais(
        @PathVariable indice: Int,
        @RequestBody atualizacao: AtualizarAgendamento
    ): ResponseEntity<Agendamento> {
        try {
            val agendamento1 = listaAgendamentos[indice]
            agendamento1.esteticista = atualizacao.novoEsteticista
            agendamento1.cliente = atualizacao.novoCliente
            agendamento1.data = atualizacao.novaData
            agendamento1.servico= atualizacao.novoServico
            agendamento1.tpServico= atualizacao.novoTpServico
            return ResponseEntity.status(200).body(agendamento1)
        } catch (exception:Exception) {
            return ResponseEntity.status(404).build()
        }
    }

    @PatchMapping("/atualizarUm/{indice}")
    fun atualizarUm(
        @PathVariable indice: Int,
        @RequestBody atualizacao: AtualizarAgendamento
    ): ResponseEntity<Agendamento> {
        try {
            val agendamento1 = listaAgendamentos[indice]
            agendamento1.esteticista = atualizacao.novoEsteticista
            agendamento1.cliente = atualizacao.novoCliente
            agendamento1.data = atualizacao.novaData
            agendamento1.servico= atualizacao.novoServico
            agendamento1.tpServico= atualizacao.novoTpServico
            return ResponseEntity.status(200).body(agendamento1)
        } catch (exception:Exception) {
            return ResponseEntity.status(404).build()
        }
    }


}
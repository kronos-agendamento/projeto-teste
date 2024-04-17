package kronos.crudagendamento.controller

import org.springframework.web.bind.annotation.RequestMapping

@RestController
@RequestMapping("/agendamentos")
class AgendamentoController(
    val agendamentoRepository:AgendamentoRepository
) {

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
        if(agendamentoReposito.existsById(codigo)){
            agendamentoRepository.delete(codigo)
            return ResponseEntity.status(204).build
        }
        return ResponseEntity.status(404).build()
    }


    @PutMapping("/{codigo}")
    fun alterarAgendamento(@PathVariable codigo:Int, @Requestbody agendamento:Agendamento)
    :ResponseEntity<Agendamento>{
        if(agendamentoRepository.existsById(codigo)){
        agendamento.codigo = codigo
            agendamentoRepository.save(agendamento)
            return ResponseEntity.status(200).body(agendamento)
        }
            return ResponseEntity.status(204).build()
    }

}
package kronos.projetoplenitutenoolhar.controller

import kronos.projetoplenitutenoolhar.dominio.Agendamento
import kronos.projetoplenitutenoolhar.repositorio.AgendamentoRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/agendamentos")
class AgendamentoController(
    val agendamentoRepository: AgendamentoRepository
) {

    @PostMapping
    fun criar(@RequestBody novoAgendamento: Agendamento,
              @Autowired agendamentoRepository: AgendamentoRepository
    ): ResponseEntity<Agendamento> {
        val agendamentoSalvo = agendamentoRepository.save(novoAgendamento)
        return ResponseEntity.status(201).body(agendamentoSalvo)
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
    fun deletar(@PathVariable codigo:Int):ResponseEntity<Void>{
        if(agendamentoRepository.existsById(codigo)){
            agendamentoRepository.deleteById(codigo)
            return ResponseEntity.status(204).build()
        }
        return ResponseEntity.status(404).build()
    }


    @PutMapping("/{codigo}")
    fun alterarAgendamento(@PathVariable codigo:Int, @RequestBody agendamento: Agendamento)
    :ResponseEntity<Agendamento>{
        if(agendamentoRepository.existsById(codigo)){
        agendamento.idAgendamento = codigo
            agendamentoRepository.save(agendamento)
            return ResponseEntity.status(200).body(agendamento)
        }
            return ResponseEntity.status(204).build()
    }

}
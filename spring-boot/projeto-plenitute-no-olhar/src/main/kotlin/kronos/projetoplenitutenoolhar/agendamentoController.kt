package kronos.projetoplenitutenoolhar

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.time.LocalDateTime

@RestController
@RequestMapping("/agendamentos")
class agendamentoController {
    fun existeAgendamento(indice: Int): Boolean {
        return indice >= 0 && indice < listaAgendamentos.size
    }
    
    // lista vazia de objetos do tipo Agendamento
    val listaAgendamentos = mutableListOf(
        Agendamento(LocalDateTime.of(2024, 3, 5, 10, 0), "Corte de Cabelo",
            "Cabelo", "João", "Maria"),
        Agendamento(LocalDateTime.of(2024, 3, 8, 15, 30), "Manicure",
            "Unhas", "Ana", "Carla"),
        Agendamento(LocalDateTime.of(2024, 3, 10, 14, 0), "Depilação",
            "Corpo", "Paula", "Fernanda"),
        Agendamento(LocalDateTime.of(2024, 3, 12, 11, 0), "Maquiagem",
            "Rosto", "Luiza", "Juliana"),
        Agendamento(LocalDateTime.of(2024, 3, 15, 9, 0), "Massagem",
            "Corpo", "Pedro", "Camila")
    )

    @PostMapping
    fun cadastrar(@RequestBody novoAgendamento: Agendamento): ResponseEntity<Agendamento> {
        listaAgendamentos.add(novoAgendamento)
        return ResponseEntity.status(201).body(novoAgendamento)
    }

    @GetMapping
    fun lista(): ResponseEntity<List<Agendamento>> {
        if (listaAgendamentos.isEmpty()) {
            return ResponseEntity.status(204).build()
        }
        return ResponseEntity.status(200).body(listaAgendamentos)
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

    @DeleteMapping("/{indice}")
    fun deletar(@PathVariable indice: Int): ResponseEntity<Agendamento> {
        if (existeAgendamento(indice)){
            listaAgendamentos.removeAt(indice)

            return ResponseEntity.status(200).build()
        }
        return ResponseEntity.status(404).build()
    }
}
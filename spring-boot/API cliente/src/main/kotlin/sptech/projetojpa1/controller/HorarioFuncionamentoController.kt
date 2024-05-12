package sptech.projetojpa1.controller

import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import sptech.projetojpa1.dominio.Endereco
import sptech.projetojpa1.dominio.HorarioFuncionamento
import sptech.projetojpa1.repository.HorarioFuncionamentoRepository

@RestController
@RequestMapping("/horario-funcionamento")
class HorarioFuncionamentoController (
    val repository:HorarioFuncionamentoRepository
){
    // Cadastro de Noo Horario de Funcionamento
    @PostMapping ("/cadastro-horario-funcionamento")
    fun post(@RequestBody @Valid novoHorario: HorarioFuncionamento): ResponseEntity<HorarioFuncionamento> {
        repository.save(novoHorario)
        return ResponseEntity.status(201).body(novoHorario)
    }

    @GetMapping("/lista-horario")
    fun listarHorariosFuncionamento(): ResponseEntity<List<HorarioFuncionamento>> {
        val lista = repository.findAll()
        return if (lista.isNotEmpty()) {
            ResponseEntity.status(200).body(lista)
        } else {
            ResponseEntity.status(404).build()
        }
    }

    // DELETE por ID
    @DeleteMapping("/exclusao-horario/{codigo}")
    fun excluirHorarioFuncionamento(@PathVariable codigo:Int):ResponseEntity<Void> {
        if (repository.existsById(codigo)) {
            repository.deleteById(codigo)
            return ResponseEntity.status(204).build()
        }
        return ResponseEntity.status(404).build()
    }

    // PATCH para atualizar horário de abertura
    @PatchMapping("/atualizar-abertura/{id}")
    fun atualizarHorarioAbertura(
        @PathVariable id: Int,
        @RequestParam("horarioAbertura") novoHorarioAbertura: String
    ): ResponseEntity<String> {
        val horarioOptional = repository.findById(id)
        return if (horarioOptional.isPresent) {
            val horario = horarioOptional.get()
            horario.horarioAbertura = novoHorarioAbertura
            repository.save(horario)
            ResponseEntity.status(200).body("Horário de abertura atualizado com sucesso")
        } else {
            ResponseEntity.status(400).body("Horário de funcionamento não encontrado para o ID fornecido")
        }
    }

    // PATCH para atualizar horário de fechamento
    @PatchMapping("/atualizar-fechamento/{id}")
    fun atualizarHorarioFechamento(
        @PathVariable id: Int,
        @RequestParam("horarioFechamento") novoHorarioFechamento: String
    ): ResponseEntity<String> {
        val horarioOptional = repository.findById(id)
        return if (horarioOptional.isPresent) {
            val horario = horarioOptional.get()
            horario.horarioFechamento = novoHorarioFechamento
            repository.save(horario)
            ResponseEntity.status(200).body("Horário de fechamento atualizado com sucesso")
        } else {
            ResponseEntity.status(404).body("Horário de funcionamento não encontrado para o ID fornecido")
        }
    }





}
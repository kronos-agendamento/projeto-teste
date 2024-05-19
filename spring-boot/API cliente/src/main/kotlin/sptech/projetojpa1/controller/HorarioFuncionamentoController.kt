package sptech.projetojpa1.controller

import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import sptech.projetojpa1.dominio.HorarioFuncionamento
import sptech.projetojpa1.repository.HorarioFuncionamentoRepository

@RestController
@RequestMapping("/horario-funcionamento")
class HorarioFuncionamentoController(
    val repository: HorarioFuncionamentoRepository
) {
    // Cadastro de Novo Horário de Funcionamento
    @PostMapping("/cadastro-horario-funcionamento")
    fun cadastrarHorarioFuncionamento(@RequestBody @Valid novoHorario: HorarioFuncionamento): ResponseEntity<HorarioFuncionamento> {
        // Salvando o novo horário de funcionamento no banco de dados
        val horarioSalvo = repository.save(novoHorario)
        return ResponseEntity.status(201).body(horarioSalvo)
    }

    // Listar Horários de Funcionamento
    @GetMapping("/lista-horario")
    fun listarHorariosFuncionamento(): ResponseEntity<List<HorarioFuncionamento>> {
        val lista = repository.findAll()
        return if (lista.isNotEmpty()) {
            // Retornando a lista de horários de funcionamento se houver algum encontrado
            ResponseEntity.status(200).body(lista)
        } else {
            // Retornando status 404 se não houver nenhum horário de funcionamento encontrado
            ResponseEntity.status(404).build()
        }
    }

    // Excluir Horário de Funcionamento por ID
    @DeleteMapping("/exclusao-horario/{id}")
    fun excluirHorarioFuncionamento(@PathVariable id: Int): ResponseEntity<Void> {
        if (repository.existsById(id)) {
            repository.deleteById(id)
            return ResponseEntity.status(204).build()
        }
        return ResponseEntity.status(404).build()
    }

    // Atualizar Horário de Abertura por ID
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

    // Atualizar Horário de Fechamento por ID
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

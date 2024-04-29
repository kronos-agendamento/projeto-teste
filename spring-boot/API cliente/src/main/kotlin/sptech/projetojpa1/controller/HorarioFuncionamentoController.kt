package sptech.projetojpa1.controller

import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import sptech.projetojpa1.dominio.Endereco
import sptech.projetojpa1.dominio.HorarioFuncionamento
import sptech.projetojpa1.repository.HorarioFuncionamentoRepository

@RestController
@RequestMapping("/horariofuncionamento")
class HorarioFuncionamentoController (
    val repository:HorarioFuncionamentoRepository
){
    // Cadastro de Noo Horario de Funcionamento
    @PostMapping
    fun post(@RequestBody @Valid novoHorario: HorarioFuncionamento): ResponseEntity<HorarioFuncionamento> {
        repository.save(novoHorario)
        return ResponseEntity.status(201).body(novoHorario)
    }

    // Listar por cod
    @GetMapping("/{codigo}")
    fun get (@PathVariable codigo:Int):ResponseEntity<HorarioFuncionamento> {
        // se existir o codigo no repositorio retorna true e recolhe esse valor
        if (repository.existsById(codigo)) {
            val horario = repository.findById(codigo).get()

            // retorna o valor encontrado
            return ResponseEntity.status(200).body(horario)
        }
        // se não encontrar o valor retorna erro sem corpo de resposta
        return ResponseEntity.status(404).build()
    }


}
package sptech.projetojpa1.controller

import jakarta.validation.Valid
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import sptech.projetojpa1.dominio.Complemento
import sptech.projetojpa1.repository.ComplementoRepository

@RestController
@RequestMapping("/complemento")
class ComplementoController (
   val repository: ComplementoRepository
) {

    // Cadastro de Novo Complemento
    @PostMapping
    fun post(@RequestBody @Valid novoComplemento: Complemento): ResponseEntity<Complemento> {
        repository.save(novoComplemento)
        return ResponseEntity.status(201).body(novoComplemento)
    }

    // Listar por código
    @GetMapping("/{codigo}")
    fun get(@PathVariable codigo:Int):ResponseEntity<Complemento> {
        // se existir o codigo no repositorio retorna true e recolhe esse valor
        if (repository.existsById(codigo)){
            val complemento = repository.findById(codigo).get()

            // retorna o valor encontrado
            return ResponseEntity.status(200).body(complemento)
        }
        // se não encontrar o valor retorna erro sem corpo de resposta
        return ResponseEntity.status(404).build()
    }

}
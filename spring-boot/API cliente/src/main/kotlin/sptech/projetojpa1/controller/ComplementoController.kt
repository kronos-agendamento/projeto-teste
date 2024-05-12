package sptech.projetojpa1.controller

import jakarta.validation.Valid
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import sptech.projetojpa1.dominio.Complemento
import sptech.projetojpa1.dominio.PatchComplemento
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
    @GetMapping("/{id}")
    fun get(@PathVariable id: Int): ResponseEntity<Any> {
        // se existir o codigo no repositorio retorna true e recolhe esse valor
        if (repository.existsById(id)) {
            val complemento = repository.findById(id).get()

            // retorna o valor encontrado
            return ResponseEntity.status(200).body(complemento)
        }
        // se não encontrar o valor retorna erro sem corpo de resposta
        return ResponseEntity.status(404).body("Complemento não encontrado para o ID fornecido")
    }

    // Listar pelo endereço
    @GetMapping("/filtro-endereco/{enderecoId}")
    fun getPorIdEndereco(@PathVariable enderecoId: Int): ResponseEntity<Any> {

        val complementos = repository.findByEnderecoId(enderecoId)

        if (complementos.isEmpty()) {
            return ResponseEntity.status(404).body("Complemento não encontrado para o ID fornecido")
        }
        return ResponseEntity.status(200).body(complementos)
    }

    @PatchMapping("/edicao-complemento/{enderecoId}")
    fun patchComplemento(
        @PathVariable enderecoId: Int,
        @RequestParam novoComplemento: String
    ):ResponseEntity<Any>{
        val lista = repository.findById(enderecoId).get()
        lista.complemento = novoComplemento
        repository.save(lista)

        return ResponseEntity.status(200).body("Complemento editado com sucesso")
    }
    @DeleteMapping("/exclusao/{id}")
    fun excluirComplemento(@PathVariable id: Int): ResponseEntity<String> {
        val complementoOptional = repository.findById(id)
        return if (complementoOptional.isPresent) {
            repository.deleteById(id)
            ResponseEntity.status(200).body("Complemento excluído com sucesso")
        } else {
            ResponseEntity.status(404).body("Complemento não encontrado para o ID fornecido")
        }
    }
}
package sptech.projetojpa1.controller

import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import sptech.projetojpa1.dominio.Empresa
import sptech.projetojpa1.dominio.Endereco
import sptech.projetojpa1.repository.EnderecoRepository

@RestController
@RequestMapping("/endereco")
class EnderecoController (
    val repository: EnderecoRepository
) {
    // Cadastro de Novo Complemento
    @PostMapping
    fun post(@RequestBody @Valid novoEndereco: Endereco): ResponseEntity<Endereco> {
        repository.save(novoEndereco)
        return ResponseEntity.status(201).body(novoEndereco)
    }

    // Listar Endereco
    @GetMapping
    fun get():ResponseEntity<List<Endereco>>{
        val lista = repository.findAll()

        // se a lista não tiver vazia retorne o resultado com status 200
        if (lista.isNotEmpty()){
            return ResponseEntity.status(200).body(lista)
        }
        // caso ela esteja vazia, retorne o erro 204
        return ResponseEntity.status(204).build()
    }

    // Listar por código
    @GetMapping("/{codigo}")
    fun get(@PathVariable codigo:Int):ResponseEntity<Endereco> {
        // se existir o codigo no repositorio retorna true e recolhe esse valor
        if (repository.existsById(codigo)) {
            val endereco = repository.findById(codigo).get()

            // retorna o valor encontrado
            return ResponseEntity.status(200).body(endereco)
        }
        // se não encontrar o valor retorna erro sem corpo de resposta
        return ResponseEntity.status(404).build()
    }



}
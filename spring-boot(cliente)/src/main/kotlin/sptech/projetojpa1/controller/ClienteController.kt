package sptech.projetojpa1.controller

import org.apache.coyote.Response
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import sptech.projetojpa1.dominio.Cliente
import sptech.projetojpa1.repository.ClienteRepository

@RestController
@RequestMapping("/clientes")
class ClienteController {

    @Autowired
    lateinit var repository: ClienteRepository

    // Cadastro de Novo Cliente
    @PostMapping
    fun post(@RequestBody novoCliente:Cliente):ResponseEntity<Cliente> {
        repository.save(novoCliente)
        return ResponseEntity.status(201).body(novoCliente)
    }

    // Listar Clientes
    @GetMapping
    fun get():ResponseEntity<List<Cliente>>{
        val lista = repository.findByStatusTrue()

        // se a lista não tiver vazia retorne o resultado com status 200
        if (lista.isNotEmpty()){
            return ResponseEntity.status(200).body(lista)
        }
        // caso ela esteja vazia, retorne o erro 204
        return ResponseEntity.status(204).build()
    }

    // Listar por código
    @GetMapping("/{codigo}")
    fun get(@PathVariable codigo:Int):ResponseEntity<Cliente> {
        // se existir o codigo no repositorio retorna true e recolhe esse valor
        if (repository.existsById(codigo)){
            val cliente = repository.findById(codigo).get()

            // retorna o valor encontrado
            return ResponseEntity.status(200).body(cliente)
        }
        // se não encontrar o valor retorna erro sem corpo de resposta
        return ResponseEntity.status(404).build()
    }

    // Desativar o usuario
    @PatchMapping ("/desativar/{codigo}")
    fun desativar(@PathVariable codigo:Int):ResponseEntity<Void> {
        if (repository.existsById(codigo)){

            var cliente = repository.findById(codigo).get()
            cliente.status = false
            repository.save(cliente)

            return ResponseEntity.status(204).build()
        }
        return ResponseEntity.status(404).build()
    }

    //Ativar usuario
    @PatchMapping ("/ativar/{codigo}")
    fun ativar(@PathVariable codigo:Int):ResponseEntity<Void> {
        if (repository.existsById(codigo)){

            var cliente = repository.findById(codigo).get()
            cliente.status = true
            repository.save(cliente)

            return ResponseEntity.status(204).build()
        }
        return ResponseEntity.status(404).build()
    }
}
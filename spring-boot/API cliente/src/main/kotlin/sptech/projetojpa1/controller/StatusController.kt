package sptech.projetojpa1.controller

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import sptech.projetojpa1.dominio.Status
import sptech.projetojpa1.repository.StatusRepository

@RestController
@RequestMapping("/statusAgendamento")
class StatusController {
    @Autowired
    lateinit var repository: StatusRepository

    @PostMapping
    fun post(@RequestBody novoStatus: Status): ResponseEntity<String> {
        val statusSalvo = repository.save(novoStatus)
        return ResponseEntity.status(201).body("Status ${statusSalvo.descricao} cadastrado com sucesso")
    }

    @GetMapping
    fun get(): ResponseEntity<List<Status>> {
        val lista = repository.findAll()
        if (lista.isNotEmpty()) {
            return ResponseEntity.status(200).body(lista)
        }
        return ResponseEntity.status(204).build()
    }

    @GetMapping("/{id}")
    fun get(@PathVariable id:Int): ResponseEntity<Status> {
        return ResponseEntity.of(repository.findById(id))
    }

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id:Int): ResponseEntity<String> {
        val lista = repository.findById(id)
        if (lista.isPresent) {
            val statusDeletado = lista.get()
            repository.deleteById(id)
            return ResponseEntity.status(204).body("Status deletado com sucesso: $statusDeletado")
        }
        return ResponseEntity.status(404).build()
    }


    @PatchMapping("/{id}")
    fun patch(@PathVariable id: Int, @RequestBody patchRequest: Status): ResponseEntity<Any> {
        // Busca o status existente pelo ID
        val statusExistente = repository.findById(id).orElse(null)
        if (statusExistente != null) {
            // Verifica se a descrição do status é "Cancelado"
            if (statusExistente.descricao.equals("Cancelado", ignoreCase = true)) {
                // Verifica se o campo motivo está presente e não vazio
                if (!patchRequest.motivo.isNullOrBlank()) {
                    // Atualiza o campo motivo e salva no banco de dados
                    statusExistente.motivo = patchRequest.motivo
                    repository.save(statusExistente)
                    return ResponseEntity.ok(statusExistente)
                } else {
                    // Retorna um erro se o campo motivo estiver vazio
                    return ResponseEntity.badRequest().body("O campo 'motivo' é obrigatório.")
                }
            } else {
                // Retorna um erro se a descrição não for "Cancelado"
                return ResponseEntity.status(400).body("O campo 'motivo' só pode ser editado quando a 'descrição' estiver como 'Cancelado'.")
            }
        }
        // Retorna um erro 404 se o status não existir
        return ResponseEntity.notFound().build()
    }}

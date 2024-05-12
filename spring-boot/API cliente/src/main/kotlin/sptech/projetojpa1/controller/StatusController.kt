package sptech.projetojpa1.controller

import jakarta.validation.Valid
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import sptech.projetojpa1.dominio.Status
import sptech.projetojpa1.repository.StatusRepository

@RestController
@RequestMapping("/status-agendamento")
class StatusController {
    @Autowired
    lateinit var repository: StatusRepository

    @PostMapping ("/cadastro-status")
    fun post(@Valid @RequestBody novoStatus: Status): ResponseEntity<String> {
        val statusSalvo = repository.save(novoStatus)
        return ResponseEntity.status(201).body("Status ${statusSalvo.nome} cadastrado com sucesso")
    }

    @GetMapping ("/lista-todos-status")
    fun get(): ResponseEntity<Any> {
        val lista = repository.findAll()
        if (lista.isNotEmpty()) {
            return ResponseEntity.status(200).body(lista)
        }
        return ResponseEntity.status(204).body("Infelizmente nenhum cadastro de status foi realizado ainda.")
    }

    @GetMapping("/filtro-por-id/{id}")
    fun get(@Valid @PathVariable id:Int): ResponseEntity<Status> {
        return ResponseEntity.of(repository.findById(id))
    }

    @DeleteMapping("/exclusao-status/{id}")
    fun delete(@Valid @PathVariable id:Int):ResponseEntity<Any> {
        if (repository.existsById(id)) {
            repository.deleteById(id)
            return ResponseEntity.status(200).body("Status deletado com sucesso.")
        }
        return ResponseEntity.status(404).body("Não encontramos o status pesquisado.")
    }


    @PatchMapping("/edicao-status/{id}")
    fun patch(@Valid @PathVariable id: Int, @RequestBody patchRequest: Status): ResponseEntity<Any> {
        // Busca o status existente pelo ID
        val statusExistente = repository.findById(id).orElse(null)
        if (statusExistente != null) {
            // Verifica se a descrição do status é "Cancelado"
            if (statusExistente.nome.equals("Cancelado", ignoreCase = true)) {
                // Verifica se o campo motivo está presente e não vazio
                if (!patchRequest.motivo.isNullOrBlank()) {
                    // Atualiza o campo motivo e salva no banco de dados
                    statusExistente.motivo = patchRequest.motivo
                    repository.save(statusExistente)
                    return ResponseEntity.ok(statusExistente)
                } else {
                    // Retorna um erro se o campo motivo estiver vazio
                    return ResponseEntity.status(400).body("O campo 'motivo' é obrigatório.")
                }
            } else {
                // Retorna um erro se a descrição não for "Cancelado"
                return ResponseEntity.status(400).body("O campo 'motivo' só pode ser editado quando a 'descrição' estiver como 'Cancelado'.")
            }
        }
        // Retorna um erro 404 se o status não existir
        return ResponseEntity.status(404).body("Status inexistente no nosso sistema.")
    }}

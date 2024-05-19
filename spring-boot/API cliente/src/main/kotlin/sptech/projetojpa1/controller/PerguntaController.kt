package sptech.projetojpa1.controller

import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import sptech.projetojpa1.dominio.Pergunta
import sptech.projetojpa1.repository.PerguntaRepository

@RestController
@RequestMapping("/ficha-pergunta")
class PerguntaController(
    val perguntaRepository: PerguntaRepository
) {
    // Cadastro de Nova Pergunta
    @PostMapping("/cadastro-perguntas")
    fun cadastrarPergunta(@RequestBody @Valid novaPergunta: Pergunta): ResponseEntity<Pergunta> {
        // Salvando a nova pergunta no banco de dados
        val perguntaSalva = perguntaRepository.save(novaPergunta)
        return ResponseEntity.status(201).body(perguntaSalva)
    }

    // Listar Todas as Perguntas
    @GetMapping("/lista-todas-perguntas")
    fun listarTodasPerguntas(): ResponseEntity<List<Pergunta>> {
        val perguntas = perguntaRepository.findAll()
        return if (perguntas.isEmpty()) {
            // Retornando status 204 se não houver perguntas encontradas
            ResponseEntity.status(204).build()
        } else {
            // Retornando a lista de perguntas se houver alguma encontrada
            ResponseEntity.status(200).body(perguntas)
        }
    }

    // Buscar Perguntas por Descrição
    @GetMapping("/filtro-por-descricao")
    fun buscarPorDescricao(@RequestParam descricao: String): ResponseEntity<List<Pergunta>> {
        val lista = perguntaRepository.findByDescricaoContainsIgnoreCase(descricao)
        return if (lista.isNotEmpty()) {
            // Retornando a lista de perguntas se houver alguma encontrada para a descrição fornecida
            ResponseEntity.status(200).body(lista)
        } else {
            // Retornando status 404 se não houver perguntas encontradas para a descrição fornecida
            ResponseEntity.status(404).build()
        }
    }

    // Listar Perguntas Ativas
    @GetMapping("/lista-perguntas-ativas")
    fun listarPerguntasAtivas(@RequestParam status: Boolean): ResponseEntity<List<Pergunta>> {
        val perguntas = perguntaRepository.findByStatus(status)
        return ResponseEntity.status(200).body(perguntas)
    }

    // Ativar Pergunta por ID
    @PatchMapping("/ativacao-pergunta/{id}")
    fun ativarPergunta(@Valid @PathVariable id: Int): ResponseEntity<Any> {
        val perguntaOptional = perguntaRepository.findById(id)
        return if (perguntaOptional.isPresent) {
            val pergunta = perguntaOptional.get()
            pergunta.status = true // Ativa a pergunta
            perguntaRepository.save(pergunta)
            ResponseEntity.status(200).body(pergunta)
        } else {
            ResponseEntity.status(404).body("Pergunta a ser ativada não encontrada.")
        }
    }

    // Desativar Pergunta por ID
    @PatchMapping("/desativacao-pergunta/{id}")
    fun desativarPergunta(@Valid @PathVariable id: Int): ResponseEntity<Any> {
        val perguntaOptional = perguntaRepository.findById(id)
        return if (perguntaOptional.isPresent) {
            val pergunta = perguntaOptional.get()
            pergunta.status = false // Desativa a pergunta
            perguntaRepository.save(pergunta)
            ResponseEntity.status(200).body(pergunta)
        } else {
            ResponseEntity.status(404).body("Pergunta a ser desativada não encontrada.")
        }
    }

    // Excluir Pergunta por ID
    @DeleteMapping("/exclusao-pergunta/{id}")
    fun deletarPergunta(@Valid @PathVariable id: Int): ResponseEntity<String> {
        val perguntaOptional = perguntaRepository.findById(id)
        return if (perguntaOptional.isPresent) {
            perguntaRepository.deleteById(id)
            ResponseEntity.status(200).body("Pergunta excluída com sucesso.")
        } else {
            ResponseEntity.status(404).body("Pergunta não encontrada para o ID fornecido.")
        }
    }
}

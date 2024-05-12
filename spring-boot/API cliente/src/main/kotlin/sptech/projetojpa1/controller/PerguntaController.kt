package sptech.projetojpa1.controller

import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import sptech.projetojpa1.dominio.Pergunta
import sptech.projetojpa1.repository.PerguntaRepository

@RestController
@RequestMapping("/ficha-pergunta")

class PerguntaController (
    val perguntaRepository: PerguntaRepository
) {
    @PostMapping ("/cadastro-perguntas")
    fun post(@RequestBody @Valid novaPergunta: Pergunta):ResponseEntity<Pergunta> {
        perguntaRepository.save(novaPergunta)

        return ResponseEntity.status(201).body(novaPergunta)
    }


    @GetMapping ("/lista-todas-perguntas")
    fun get():ResponseEntity<List<Pergunta>> {
        val perguntas = perguntaRepository.findAll()

        if(perguntas.isEmpty()){
            return ResponseEntity.status(204).build()
        }
        return ResponseEntity.status(200).body(perguntas)
    }

    @GetMapping("/filtro-por-descricao")
    fun buscarPorDescricao(@RequestParam descricao: String): ResponseEntity<List<Pergunta>> {
        val lista = perguntaRepository.findByDescricaoContainsIgnoreCase(descricao)
        return if (lista.isNotEmpty()) {
            ResponseEntity.status(200).body(lista)
        } else {
            ResponseEntity.status(404).build()
        }
    }

    @GetMapping("/lista-perguntas-ativas")
    fun getAtivas(@Valid @RequestParam status:Boolean):ResponseEntity<List<Pergunta>> {
        val perguntas = perguntaRepository.findByStatus(status)

        return ResponseEntity.status(200).body(perguntas)
    }

    @PatchMapping("/ativacao-pergunta/{id}")
    fun perguntaAtivada(@Valid @RequestParam id: Int):ResponseEntity<Any> {
        var perguntaOptional = perguntaRepository.findById(id)

        // Verifica se a pergunta foi encontrada
        if (perguntaOptional.isPresent) {
            val pergunta = perguntaOptional.get()

            // Atualiza o status da pergunta para true
            pergunta.status = true

            // Salva a pergunta atualizada no repositório
            perguntaRepository.save(pergunta)

            return ResponseEntity.status(200).body(pergunta)
        } else {
            // Retorna uma resposta 404 caso a pergunta não seja encontrada
            return ResponseEntity.status(404).body("Pergunta aativada não encontrada.")
        }
    }

    @PatchMapping("/desativacao-pergunta/{id}")
    fun perguntaDesativada(@Valid @RequestParam id: Int):ResponseEntity<Any> {
        var perguntaOptional = perguntaRepository.findById(id)

        // Verifica se a pergunta foi encontrada
        if (perguntaOptional.isPresent) {
            val pergunta = perguntaOptional.get()

            // Atualiza o status da pergunta para false
            pergunta.status = false

            // Salva a pergunta atualizada no repositório
            perguntaRepository.save(pergunta)

            return ResponseEntity.status(200).body(pergunta)
        } else {
            // Retorna uma resposta 404 caso a pergunta não seja encontrada
            return ResponseEntity.status(404).body("Pergunta desativada não encontrada.")
        }
    }
    @DeleteMapping("/exclusao-pergunta/{id}")
    fun deletarPergunta(@Valid @PathVariable id: Int): ResponseEntity<String> {
        val resposta = perguntaRepository.findById(id)
        if (resposta.isPresent) {
            perguntaRepository.deleteById(id)
            return ResponseEntity.status(200).body("Pergunta excluída com sucesso.")
        }
        return ResponseEntity.status(404).body("Pergunta não encontrada para o ID fornecido.")
    }

//    -> CONTROLLER Perguntas:
//    - GET all que estão ativas.
//    - PATCH de status ativo ou inativo (por descrição da pergunta).

}
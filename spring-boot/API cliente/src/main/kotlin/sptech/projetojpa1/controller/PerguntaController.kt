package sptech.projetojpa1.controller

import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import sptech.projetojpa1.dominio.Pergunta
import sptech.projetojpa1.repository.PerguntaRepository

@RestController
@RequestMapping("/ficha/pergunta")

class PerguntaController (
    val perguntaRepository: PerguntaRepository
) {
    @PostMapping
    fun post(@RequestBody @Valid novaPergunta: Pergunta):ResponseEntity<Pergunta> {
        perguntaRepository.save(novaPergunta)

        return ResponseEntity.status(201).body(novaPergunta)
    }


    @GetMapping
    fun get():ResponseEntity<List<Pergunta>> {
        val perguntas = perguntaRepository.findAll()

        if(perguntas.isEmpty()){
            return ResponseEntity.status(204).build()
        }
        return ResponseEntity.status(200).body(perguntas)
    }

    @GetMapping("/perguntasStatus")
    fun getAtivas(@RequestParam status:Boolean):ResponseEntity<List<Pergunta>> {
        val perguntas = perguntaRepository.findByStatus(status)

        
        return ResponseEntity.status(200).body(perguntas)
    }

    @PatchMapping("/perguntaAtivada")
    fun perguntaAtivada(@RequestParam codigo: Int):ResponseEntity<Pergunta> {
        var perguntaOptional = perguntaRepository.findById(codigo)

        // Verifica se a pergunta foi encontrada
        if (perguntaOptional.isPresent) {
            val pergunta = perguntaOptional.get()

            // Atualiza o status da pergunta para true
            pergunta.status = true

            // Salva a pergunta atualizada no repositório
            perguntaRepository.save(pergunta)

            return ResponseEntity.ok(pergunta)
        } else {
            // Retorna uma resposta 404 caso a pergunta não seja encontrada
            return ResponseEntity.notFound().build()
        }
    }

    @PatchMapping("/perguntaDesativada")
    fun perguntaDesativada(@RequestParam codigo: Int):ResponseEntity<Pergunta> {
        var perguntaOptional = perguntaRepository.findById(codigo)

        // Verifica se a pergunta foi encontrada
        if (perguntaOptional.isPresent) {
            val pergunta = perguntaOptional.get()

            // Atualiza o status da pergunta para false
            pergunta.status = false

            // Salva a pergunta atualizada no repositório
            perguntaRepository.save(pergunta)

            return ResponseEntity.ok(pergunta)
        } else {
            // Retorna uma resposta 404 caso a pergunta não seja encontrada
            return ResponseEntity.notFound().build()
        }
    }

//    -> CONTROLLER Perguntas:
//    - GET all que estão ativas.
//    - PATCH de status ativo ou inativo (por descrição da pergunta).

}
package sptech.projetojpa1.controller

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import sptech.projetojpa1.dominio.Pergunta
import sptech.projetojpa1.repository.PerguntaRepository

@RestController
@RequestMapping("/ficha/pergunta")

class PerguntaController (
    val perguntaRepository: PerguntaRepository
) {
    @PostMapping
    fun post(@RequestBody novaPergunta: Pergunta):ResponseEntity<Pergunta> {
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

}
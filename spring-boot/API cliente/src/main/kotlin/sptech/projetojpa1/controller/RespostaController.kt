package sptech.projetojpa1.controller

import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import sptech.projetojpa1.dominio.Resposta
import sptech.projetojpa1.repository.RespostaRepository


@RestController
@RequestMapping("/resposta")
class RespostaController (
    val respostaRepository: RespostaRepository
) {

    @PostMapping()
    fun post(@RequestBody @Valid novaResposta: Resposta): ResponseEntity<Resposta> {
        val respostaSalva = respostaRepository.save(novaResposta)

        return ResponseEntity.status(201).body(respostaSalva)
    }

    @GetMapping()
    fun get():ResponseEntity<List<Resposta>> {
        val respostas = respostaRepository.findAll()

        if(respostas.isEmpty()){
            return ResponseEntity.status(204).build()
        }
        return ResponseEntity.status(200).body(respostas)
    }
}
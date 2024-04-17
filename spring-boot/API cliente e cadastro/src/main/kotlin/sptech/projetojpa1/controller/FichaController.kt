package sptech.projetojpa1.controller

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import sptech.projetojpa1.dominio.Ficha
import sptech.projetojpa1.dominio.Pergunta
import sptech.projetojpa1.repository.FichaRepository

@RestController
@RequestMapping("/ficha")
class FichaController (
    val fichaRepository: FichaRepository
) {
    @PostMapping
    fun post(@RequestBody novaFicha: Ficha): ResponseEntity<Ficha> {
fichaRepository
        return ResponseEntity.status(201).body(novaFicha)
    }

    @GetMapping
    fun get():ResponseEntity<List<Ficha>> {
        val fichas = fichaRepository.findAll()

        if(fichas.isEmpty()){
            return ResponseEntity.status(204).build()
        }
        return ResponseEntity.status(200).body(fichas)
    }

}
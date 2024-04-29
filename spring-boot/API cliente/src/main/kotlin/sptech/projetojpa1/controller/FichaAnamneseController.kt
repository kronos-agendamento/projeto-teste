package sptech.projetojpa1.controller

import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import sptech.projetojpa1.dominio.FichaAnamnese
import sptech.projetojpa1.repository.FichaAnamneseRepository

@RestController
@RequestMapping("/ficha")
class FichaAnamneseController (
    val fichaAnamneseRepository: FichaAnamneseRepository
) {
    @PostMapping
    fun post(@RequestBody @Valid novaFichaAnamnese: FichaAnamnese): ResponseEntity<FichaAnamnese> {
fichaAnamneseRepository
        return ResponseEntity.status(201).body(novaFichaAnamnese)
    }

    @GetMapping
    fun get():ResponseEntity<List<FichaAnamnese>> {
        val fichas = fichaAnamneseRepository.findAll()

        if(fichas.isEmpty()){
            return ResponseEntity.status(204).build()
        }
        return ResponseEntity.status(200).body(fichas)
    }

}
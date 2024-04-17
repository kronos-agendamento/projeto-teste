package sptech.projetojpa1.controller

import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import sptech.projetojpa1.dominio.Pergunta
import sptech.projetojpa1.dominio.PerguntaFicha
import sptech.projetojpa1.repository.PerguntaFichaRepository
import sptech.projetojpa1.repository.PerguntaRepository

@RestController
@RequestMapping("/ficha/perguntaficha")
class PerguntaFichaController (
    val perguntafichaRepository: PerguntaFichaRepository
) {

        // Listar Perguntas ativas
        @GetMapping
        fun get(): ResponseEntity<List<PerguntaFicha>> {
            val lista = perguntafichaRepository.findByStatusTrue()

            // se a lista não tiver vazia retorne o resultado com status 200
            if (lista.isNotEmpty()){
                return ResponseEntity.status(200).body(lista)
            }
            // caso ela esteja vazia, retorne o erro 204
            return ResponseEntity.status(204).build()
        }

        @GetMapping("/todos")
        fun gettodos(): ResponseEntity<List<PerguntaFicha>> {
            val perguntasficha = perguntafichaRepository.findAll()

            if(perguntasficha.isEmpty()){
                return ResponseEntity.status(204).build()
            }
            return ResponseEntity.status(200).body(perguntasficha)
        }

}
package sptech.projetojpa1.controller

import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import sptech.projetojpa1.dominio.Empresa
import sptech.projetojpa1.dominio.NivelAcesso
import sptech.projetojpa1.dominio.Resposta
import sptech.projetojpa1.dominio.Usuario
import sptech.projetojpa1.repository.NivelAcessoRepository

@RestController
@RequestMapping("/nivelAcesso")
class NivelAcessoController (
    val repository: NivelAcessoRepository
){
    // Cadastro de Novo Nivel de Acesso
    @PostMapping
    fun post(@RequestBody @Valid novoNivelAcesso: NivelAcesso): ResponseEntity<NivelAcesso> {
        repository.save(novoNivelAcesso)
        return ResponseEntity.status(201).body(novoNivelAcesso)
    }

    @GetMapping
    fun get():ResponseEntity<List<NivelAcesso>>{
        val lista = repository.findAll()

        if (lista.isNotEmpty()){
            return ResponseEntity.status(200).body(lista)
        }
        return ResponseEntity.status(204).build()
    }



}
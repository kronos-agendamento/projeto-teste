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
@RequestMapping("/nivel-acesso")
class NivelAcessoController (
    val repository: NivelAcessoRepository
){
    // Cadastro de Novo Nivel de Acesso
    @PostMapping ("/cadastro-nivel-acesso")
    fun post(@RequestBody @Valid novoNivelAcesso: NivelAcesso): ResponseEntity<NivelAcesso> {
        repository.save(novoNivelAcesso)
        return ResponseEntity.status(201).body(novoNivelAcesso)
    }

    @GetMapping ("/lista-nivel-acesso")
    fun get():ResponseEntity<List<NivelAcesso>>{
        val lista = repository.findAll()

        if (lista.isNotEmpty()){
            return ResponseEntity.status(200).body(lista)
        }
        return ResponseEntity.status(204).build()
    }

    @PatchMapping("/atualizar-nome/{id}")
    fun atualizarNomeNivelAcesso(
        @PathVariable id: Int,
        @RequestBody novoNome: String
    ): ResponseEntity<String> {
        val nivelAcessoOptional = repository.findById(id)
        return if (nivelAcessoOptional.isPresent) {
            val nivelAcesso = nivelAcessoOptional.get()
            nivelAcesso.nome = novoNome
            repository.save(nivelAcesso)
            ResponseEntity.status(200).body("Nome atualizado com sucesso")
        } else {
            ResponseEntity.status(404).body("Nível de acesso não encontrado para o ID fornecido")
        }
    }

    @DeleteMapping("/exclusao-nivel-acesso/{id}")
    fun excluirNivelAcesso(@PathVariable id: Int): ResponseEntity<String> {
        val nivelAcessoOptional = repository.findById(id)
        return if (nivelAcessoOptional.isPresent) {
            repository.deleteById(id)
            ResponseEntity.status(200).body("Nível de acesso excluído com sucesso")
        } else {
            ResponseEntity.status(404).body("Nível de acesso não encontrado para o ID fornecido")
        }
    }



}
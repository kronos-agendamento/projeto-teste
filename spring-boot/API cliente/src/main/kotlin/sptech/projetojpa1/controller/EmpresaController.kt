package sptech.projetojpa1.controller

import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import sptech.projetojpa1.dominio.Empresa
import sptech.projetojpa1.dominio.Endereco
import sptech.projetojpa1.repository.EmpresaRepository

@RestController
@RequestMapping("/empresa")
class EmpresaController (
    val repository :EmpresaRepository
){
    // Cadastro de Nova Empresa
    @PostMapping
    fun post(@RequestBody @Valid novaEmpresa: Empresa): ResponseEntity<Empresa> {
        repository.save(novaEmpresa)
        return ResponseEntity.status(201).body(novaEmpresa)
    }

    // Listar empresas
    @GetMapping
    fun get():ResponseEntity<List<Empresa>>{
        val lista = repository.findAll()

        if (lista.isNotEmpty()){
            return ResponseEntity.status(200).body(lista)
        }
        return ResponseEntity.status(204).build()
    }

    @GetMapping("/filtro-nome/{nome}")
    fun filtroNome(@PathVariable nome:String):ResponseEntity<List<Empresa>>{
        var empresas = repository.findByNomeContains(nome)

        if (empresas.isEmpty()){
            return ResponseEntity.status(204).build()
        }
        return ResponseEntity.status(200).body(empresas)
    }

}
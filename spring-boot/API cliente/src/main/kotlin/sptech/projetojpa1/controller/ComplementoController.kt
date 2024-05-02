package sptech.projetojpa1.controller

import jakarta.validation.Valid
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import sptech.projetojpa1.dominio.Complemento
import sptech.projetojpa1.dominio.PatchComplemento
import sptech.projetojpa1.repository.ComplementoRepository

@RestController
@RequestMapping("/complemento")
class ComplementoController (
   val repository: ComplementoRepository
) {

    // Cadastro de Novo Complemento
    @PostMapping
    fun post(@RequestBody @Valid novoComplemento: Complemento): ResponseEntity<Complemento> {
        repository.save(novoComplemento)
        return ResponseEntity.status(201).body(novoComplemento)
    }

    // Listar por código
    @GetMapping("/{codigo}")
    fun get(@PathVariable codigo: Int): ResponseEntity<Complemento> {
        // se existir o codigo no repositorio retorna true e recolhe esse valor
        if (repository.existsById(codigo)) {
            val complemento = repository.findById(codigo).get()

            // retorna o valor encontrado
            return ResponseEntity.status(200).body(complemento)
        }
        // se não encontrar o valor retorna erro sem corpo de resposta
        return ResponseEntity.status(404).build()
    }

    // Listar pelo endereço
    @GetMapping("/filtro-endereco/{enderecoId}")
    fun getPorIdEndereco(@PathVariable enderecoId: Int): ResponseEntity<List<Complemento>> {

        val complementos = repository.findByEnderecoId(enderecoId)

        if (complementos.isEmpty()) {
            return ResponseEntity.status(204).build()
        }
        return ResponseEntity.status(200).body(complementos)
    }

//    @PatchMapping("/edicaoPorEndereco/{enderecoId}")
//    fun patchComplemento(
//        @PathVariable enderecoId: Int,
//        @RequestBody atualizacao: PatchComplemento
//        ):ResponseEntity<Complemento>{
//        try {
//            val complemento = repository.findById(enderecoId).get()
//
//            complemento.complemento = atualizacao.novoComplemento
//            repository.save(complemento)
//
//            return ResponseEntity.status(200).body(complemento)
//        } catch (exception:Exception){
//            return ResponseEntity.status(404).build()
//        }
//    }


    @PatchMapping("/edicao-complemento/{enderecoId}")
    fun patchComplemento(
        @PathVariable enderecoId: Int,
        @RequestParam novoComplemento: String
    ):ResponseEntity<Complemento>{
        val lista = repository.findById(enderecoId).get()
        lista.complemento = novoComplemento
        repository.save(lista)

        return ResponseEntity.status(204).build()
    }
}
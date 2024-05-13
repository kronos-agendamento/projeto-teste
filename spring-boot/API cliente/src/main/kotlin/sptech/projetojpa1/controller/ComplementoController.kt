package sptech.projetojpa1.controller

import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import sptech.projetojpa1.dominio.Complemento
import sptech.projetojpa1.repository.ComplementoRepository

@RestController
@RequestMapping("/complemento")
class ComplementoController(
    val repository: ComplementoRepository
) {

    // Cadastro de Novo Complemento
    @PostMapping
    fun cadastrarComplemento(@RequestBody @Valid novoComplemento: Complemento): ResponseEntity<Complemento> {
        // Salvando o novo complemento no banco de dados
        repository.save(novoComplemento)
        return ResponseEntity.status(201).body(novoComplemento)
    }

    // Listar Complemento por ID
    @GetMapping("/{id}")
    fun obterComplementoPorId(@PathVariable id: Int): ResponseEntity<Any> {
        // Verificando se o complemento existe no repositório
        if (repository.existsById(id)) {
            // Buscando o complemento pelo ID se existir no repositório
            val complemento = repository.findById(id).get()
            return ResponseEntity.status(200).body(complemento)
        }
        // Retornando status 404 se o complemento não for encontrado
        return ResponseEntity.status(404).body("Complemento não encontrado para o ID fornecido")
    }

    // Listar Complemento por ID de Endereço
    @GetMapping("/filtro-endereco/{enderecoId}")
    fun obterComplementosPorIdEndereco(@PathVariable enderecoId: Int): ResponseEntity<Any> {
        // Buscando complementos pelo ID de endereço
        val complementos = repository.findByEnderecoId(enderecoId)
        return if (complementos.isEmpty()) {
            // Retornando status 404 se nenhum complemento for encontrado para o ID de endereço fornecido
            ResponseEntity.status(404).body("Complemento não encontrado para o ID fornecido")
        } else {
            // Retornando a lista de complementos se houver algum encontrado para o ID de endereço fornecido
            ResponseEntity.status(200).body(complementos)
        }
    }

    // Edição de Complemento por ID de Endereço
    @PatchMapping("/edicao-complemento/{enderecoId}")
    fun editarComplemento(
        @PathVariable enderecoId: Int,
        @RequestParam novoComplemento: String
    ): ResponseEntity<Any> {
        // Verificando se o complemento existe no repositório
        val complementoOptional = repository.findById(enderecoId)
        return if (complementoOptional.isPresent) {
            val complemento = complementoOptional.get()
            // Atualizando o complemento com o novo valor fornecido
            complemento.complemento = novoComplemento
            repository.save(complemento)
            // Retornando mensagem de sucesso após editar o complemento
            ResponseEntity.status(200).body("Complemento editado com sucesso")
        } else {
            // Retornando status 404 se o complemento não for encontrado para o ID fornecido
            ResponseEntity.status(404).body("Complemento não encontrado para o ID fornecido")
        }
    }

    // Excluir Complemento por ID
    @DeleteMapping("/exclusao/{id}")
    fun excluirComplemento(@PathVariable id: Int): ResponseEntity<String> {
        // Verificando se o complemento existe no repositório
        val complementoOptional = repository.findById(id)
        return if (complementoOptional.isPresent) {
            // Excluindo o complemento se existir no repositório
            repository.deleteById(id)
            // Retornando mensagem de sucesso após excluir o complemento
            ResponseEntity.status(200).body("Complemento excluído com sucesso")
        } else {
            // Retornando status 404 se o complemento não for encontrado para o ID fornecido
            ResponseEntity.status(404).body("Complemento não encontrado para o ID fornecido")
        }
    }
}

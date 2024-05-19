package sptech.projetojpa1.controller

import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import sptech.projetojpa1.dominio.NivelAcesso
import sptech.projetojpa1.repository.NivelAcessoRepository

@RestController
@RequestMapping("/nivel-acesso")
class NivelAcessoController(
    val repository: NivelAcessoRepository
) {
    // Cadastro de Novo Nível de Acesso
    @PostMapping("/cadastro-nivel-acesso")
    fun cadastrarNivelAcesso(@RequestBody @Valid novoNivelAcesso: NivelAcesso): ResponseEntity<NivelAcesso> {
        // Salvando o novo nível de acesso no banco de dados
        val nivelAcessoSalvo = repository.save(novoNivelAcesso)
        return ResponseEntity.status(201).body(nivelAcessoSalvo)
    }

    // Listar Níveis de Acesso
    @GetMapping("/lista-nivel-acesso")
    fun listarNiveisAcesso(): ResponseEntity<List<NivelAcesso>> {
        // Buscando todos os níveis de acesso no banco de dados
        val lista = repository.findAll()

        return if (lista.isNotEmpty()) {
            // Retornando a lista de níveis de acesso se houver algum encontrado
            ResponseEntity.status(200).body(lista)
        } else {
            // Retornando status 204 se não houver nenhum nível de acesso encontrado
            ResponseEntity.status(204).build()
        }
    }

    // Atualizar Nome do Nível de Acesso por ID
    @PatchMapping("/atualizar-nome/{id}")
    fun atualizarNomeNivelAcesso(
        @PathVariable id: Int,
        @RequestBody novoNome: String
    ): ResponseEntity<String> {
        // Buscando o nível de acesso pelo ID
        val nivelAcessoOptional = repository.findById(id)
        return if (nivelAcessoOptional.isPresent) {
            val nivelAcesso = nivelAcessoOptional.get()
            // Atualizando o nome do nível de acesso
            nivelAcesso.nome = novoNome
            repository.save(nivelAcesso)
            ResponseEntity.status(200).body("Nome atualizado com sucesso")
        } else {
            // Retornando status 404 se o nível de acesso não for encontrado para o ID fornecido
            ResponseEntity.status(404).body("Nível de acesso não encontrado para o ID fornecido")
        }
    }

    // Excluir Nível de Acesso por ID
    @DeleteMapping("/exclusao-nivel-acesso/{id}")
    fun excluirNivelAcesso(@PathVariable id: Int): ResponseEntity<String> {
        // Buscando o nível de acesso pelo ID
        val nivelAcessoOptional = repository.findById(id)
        return if (nivelAcessoOptional.isPresent) {
            // Excluindo o nível de acesso
            repository.deleteById(id)
            ResponseEntity.status(200).body("Nível de acesso excluído com sucesso")
        } else {
            // Retornando status 404 se o nível de acesso não for encontrado para o ID fornecido
            ResponseEntity.status(404).body("Nível de acesso não encontrado para o ID fornecido")
        }
    }
}

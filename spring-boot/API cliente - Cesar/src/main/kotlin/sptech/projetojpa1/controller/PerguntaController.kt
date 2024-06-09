//package sptech.projetojpa1.controller
//
//import jakarta.validation.Valid
//import org.springframework.http.ResponseEntity
//import org.springframework.web.bind.annotation.*
//import sptech.projetojpa1.dominio.Pergunta
//import sptech.projetojpa1.repository.PerguntaRepository
//
//@RestController
//@RequestMapping("/ficha-pergunta")
//class PerguntaController(
//    val perguntaRepository: PerguntaRepository
//) {
//    // Cadastro de Nova Pergunta
//    @PostMapping("/cadastro-perguntas")
//    fun cadastrarPergunta(@RequestBody @Valid novaPergunta: Pergunta): ResponseEntity<Pergunta> {
//        // Salvando a nova pergunta no banco de dados
//        val perguntaSalva = perguntaRepository.save(novaPergunta)
//        return ResponseEntity.status(201).body(perguntaSalva)
//    }
//
//    // Listar Todas as Perguntas
//    @GetMapping("/lista-todas-perguntas")
//    fun listarTodasPerguntas(): ResponseEntity<List<Pergunta>> {
//        val perguntas = perguntaRepository.findAll()
//        return if (perguntas.isEmpty()) {
//            // Retornando status 204 se não houver perguntas encontradas
//            ResponseEntity.status(204).build()
//        } else {
//            // Retornando a lista de perguntas se houver alguma encontrada
//            ResponseEntity.status(200).body(perguntas)
//        }
//    }
//
//    // Buscar Perguntas por Descrição
//    @GetMapping("/filtro-por-descricao")
//    fun buscarPorDescricao(@RequestParam descricao: String): ResponseEntity<List<Pergunta>> {
//        val lista = perguntaRepository.findByDescricaoContainsIgnoreCase(descricao)
//        return if (lista.isNotEmpty()) {
//            // Retornando a lista de perguntas se houver alguma encontrada para a descrição fornecida
//            ResponseEntity.status(200).body(lista)
//        } else {
//            // Retornando status 404 se não houver perguntas encontradas para a descrição fornecida
//            ResponseEntity.status(404).build()
//        }
//    }
//
//    // Listar Perguntas Ativas
//    @GetMapping("/lista-perguntas-ativas")
//    fun listarPerguntasAtivas(@RequestParam status: Boolean): ResponseEntity<List<Pergunta>> {
//        val perguntas = perguntaRepository.findByStatus(status)
//        return ResponseEntity.status(200).body(perguntas)
//    }
//
//    // Ativar Pergunta por ID
//    @PatchMapping("/ativacao-pergunta/{id}")
//    fun ativarPergunta(@Valid @PathVariable id: Int): ResponseEntity<Any> {
//        val perguntaOptional = perguntaRepository.findById(id)
//        return if (perguntaOptional.isPresent) {
//            val pergunta = perguntaOptional.get()
//            pergunta.status = true // Ativa a pergunta
//            perguntaRepository.save(pergunta)
//            ResponseEntity.status(200).body(pergunta)
//        } else {
//            ResponseEntity.status(404).body("Pergunta a ser ativada não encontrada.")
//        }
//    }
//
//    // Desativar Pergunta por ID
//    @PatchMapping("/desativacao-pergunta/{id}")
//    fun desativarPergunta(@Valid @PathVariable id: Int): ResponseEntity<Any> {
//        val perguntaOptional = perguntaRepository.findById(id)
//        return if (perguntaOptional.isPresent) {
//            val pergunta = perguntaOptional.get()
//            pergunta.status = false // Desativa a pergunta
//            perguntaRepository.save(pergunta)
//            ResponseEntity.status(200).body(pergunta)
//        } else {
//            ResponseEntity.status(404).body("Pergunta a ser desativada não encontrada.")
//        }
//    }
//
//    // Excluir Pergunta por ID
//    @DeleteMapping("/exclusao-pergunta/{id}")
//    fun deletarPergunta(@Valid @PathVariable id: Int): ResponseEntity<String> {
//        val perguntaOptional = perguntaRepository.findById(id)
//        return if (perguntaOptional.isPresent) {
//            perguntaRepository.deleteById(id)
//            ResponseEntity.status(200).body("Pergunta excluída com sucesso.")
//        } else {
//            ResponseEntity.status(404).body("Pergunta não encontrada para o ID fornecido.")
//        }
//    }
//}
package sptech.projetojpa1.controller

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import sptech.projetojpa1.dominio.Pergunta
import sptech.projetojpa1.dto.pergunta.PerguntaRequest
import sptech.projetojpa1.service.PerguntaService

@RestController
@RequestMapping("/ficha-pergunta")
class PerguntaController(
    val perguntaService: PerguntaService
) {

    @Operation(summary = "Cadastrar nova pergunta")
    @ApiResponses(value = [
        ApiResponse(responseCode = "201", description = "Recurso criado com sucesso. Retorna a pergunta cadastrada"),
        ApiResponse(responseCode = "400", description = "Requisição inválida. Retorna uma mensagem de erro"),
        ApiResponse(responseCode = "500", description = "Erro interno do servidor. Retorna uma mensagem de erro")
    ])
    @PostMapping("/cadastro-perguntas")
    fun cadastrarPergunta(@RequestBody @Valid novaPergunta: PerguntaRequest): ResponseEntity<PerguntaRequest> {
        val perguntaSalva = perguntaService.cadastrarPergunta(novaPergunta)
        return ResponseEntity.status(201).body(perguntaSalva)
    }

    @Operation(summary = "Listar todas as perguntas")
    @ApiResponses(value = [
        ApiResponse(responseCode = "200", description = "Operação bem-sucedida. Retorna uma lista de perguntas"),
        ApiResponse(responseCode = "204", description = "Requisição bem-sucedida, mas não há conteúdo para ser exibido. Retorna uma resposta vazia"),
        ApiResponse(responseCode = "500", description = "Erro interno do servidor. Retorna uma mensagem de erro")
    ])
    @GetMapping
    fun listarTodasPerguntas(): ResponseEntity<List<PerguntaRequest>> {
        val perguntas = perguntaService.listarTodasPerguntas()
        return if (perguntas.isEmpty()) {
            ResponseEntity.status(204).build()
        } else {
            ResponseEntity.status(200).body(perguntas)
        }
    }

    @Operation(summary = "Listar perguntas por descrição")
    @ApiResponses(value = [
        ApiResponse(responseCode = "200", description = "Operação bem-sucedida. Retorna as perguntas encontradas"),
        ApiResponse(responseCode = "204", description = "Perguntas não encontradas"),
        ApiResponse(responseCode = "500", description = "Erro interno do servidor. Retorna uma mensagem de erro")
    ])
    @GetMapping("/listar-por-descricao/{descricao}")
    fun buscarPorDescricao(@RequestParam descricao: String): ResponseEntity<List<PerguntaRequest>> {
        val perguntas = perguntaService.buscarPorDescricao(descricao)
        return if (perguntas.isNotEmpty()) {
            ResponseEntity.status(200).body(perguntas)
        } else {
            ResponseEntity.status(404).build()
        }
    }

    @Operation(summary = "Listar perguntas por status ativo")
    @ApiResponses(value = [
        ApiResponse(responseCode = "200", description = "Operação bem-sucedida. Retorna as perguntas encontradas"),
        ApiResponse(responseCode = "204", description = "Perguntas não encontradas"),
        ApiResponse(responseCode = "500", description = "Erro interno do servidor. Retorna uma mensagem de erro")
    ])
    @GetMapping("/lista-perguntas-ativas")
    fun listarPerguntasAtivas(@RequestParam status: Boolean): ResponseEntity<List<PerguntaRequest>> {
        val perguntas = perguntaService.listarPerguntasAtivas(status)
        return ResponseEntity.status(200).body(perguntas)
    }


    @Operation(summary = "Ativar pergunta")
    @ApiResponses(value = [
        ApiResponse(responseCode = "200", description = "Operação bem-sucedida. Retorna a pergunta ativada"),
        ApiResponse(responseCode = "404", description = "Pergunta não encontrada"),
        ApiResponse(responseCode = "500", description = "Erro interno do servidor. Retorna uma mensagem de erro")
    ])
    @PatchMapping("/ativacao-pergunta/{id}")
    fun ativarPergunta(@Valid @PathVariable id: Int): ResponseEntity<Any> {
        val perguntaAtualizada = perguntaService.alterarStatusPergunta(id, true)
        return if (perguntaAtualizada != null) {
            ResponseEntity.status(200).body(perguntaAtualizada)
        } else {
            ResponseEntity.status(404).body("Pergunta a ser ativada não encontrada.")
        }
    }

    @Operation(summary = "Desativar pergunta")
    @ApiResponses(value = [
        ApiResponse(responseCode = "200", description = "Operação bem-sucedida. Retorna a pergunta desativada"),
        ApiResponse(responseCode = "404", description = "Pergunta não encontrada"),
        ApiResponse(responseCode = "500", description = "Erro interno do servidor. Retorna uma mensagem de erro")
    ])
    @PatchMapping("/desativacao-pergunta/{id}")
    fun desativarPergunta(@Valid @PathVariable id: Int): ResponseEntity<Any> {
        val perguntaAtualizada = perguntaService.alterarStatusPergunta(id, false)
        return if (perguntaAtualizada != null) {
            ResponseEntity.status(200).body(perguntaAtualizada)
        } else {
            ResponseEntity.status(404).body("Pergunta a ser desativada não encontrada.")
        }
    }

    @Operation(summary = "Editar pergunta")
    @ApiResponses(value = [
        ApiResponse(responseCode = "200", description = "Operação bem-sucedida. Retorna a pergunta editada"),
        ApiResponse(responseCode = "404", description = "Pergunta não encontrada"),
        ApiResponse(responseCode = "500", description = "Erro interno do servidor. Retorna uma mensagem de erro")
    ])
    @PatchMapping("/atualizacao-descricao/{id}")
    fun editarDescricaoPergunta(@PathVariable id: Int, @RequestParam descricao: String): ResponseEntity<Any> {
        val perguntaAtualizada = perguntaService.editarDescricaoPergunta(id, descricao)
        return if (perguntaAtualizada != null) {
            ResponseEntity.status(200).body(perguntaAtualizada)
        } else {
            ResponseEntity.status(404).body("Pergunta não encontrada para o ID fornecido.")
        }
    }


    // Get Personalidade - César
    @GetMapping("perguntas-personalidade")
    fun buscarPerguntasPersonalidade(): List<Pergunta> {
        val perguntas = perguntaService.listarPerguntasPersonalidade()
        return perguntas
    }
}

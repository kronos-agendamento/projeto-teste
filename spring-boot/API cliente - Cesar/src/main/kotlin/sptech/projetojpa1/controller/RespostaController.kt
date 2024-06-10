package sptech.projetojpa1.controller

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import sptech.projetojpa1.dto.resposta.RespostaFilteredDTO
import sptech.projetojpa1.dto.resposta.RespostaPersonalidade
import sptech.projetojpa1.dto.resposta.RespostaRequestDTO
import sptech.projetojpa1.dto.resposta.RespostaResponseDTO
import sptech.projetojpa1.service.RespostaService

@RestController
@RequestMapping("/api/respostas")
class RespostaController(
    private val respostaService: RespostaService
) {

    @Operation(summary = "Cadastrar uma nova resposta")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "201", description = "Resposta cadastrada com sucesso"),
            ApiResponse(responseCode = "400", description = "Dados inválidos")
        ]
    )
    @PostMapping("/cadastrar")
    fun cadastrarResposta(@RequestBody @Valid novaResposta: RespostaRequestDTO): ResponseEntity<RespostaResponseDTO> {
        val respostaSalva = respostaService.cadastrarResposta(novaResposta)
        return ResponseEntity.status(201).body(respostaSalva)
    }

    @Operation(summary = "Listar todas as respostas")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Lista de respostas"),
            ApiResponse(responseCode = "204", description = "Nenhuma resposta encontrada")
        ]
    )
    @GetMapping("/listar")
    fun listarTodasRespostas(): ResponseEntity<List<RespostaResponseDTO>> {
        val respostas = respostaService.listarTodasRespostas()
        return if (respostas.isEmpty()) {
            ResponseEntity.status(204).build()
        } else {
            ResponseEntity.ok(respostas)
        }
    }

    @Operation(summary = "Filtrar respostas por CPF do usuário")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Lista de respostas filtradas por CPF"),
            ApiResponse(responseCode = "204", description = "Nenhuma resposta encontrada para o CPF fornecido")
        ]
    )
    @GetMapping("/filtrar/cpf/{cpf}")
    fun filtrarPorCpf(@Valid @PathVariable cpf: String): ResponseEntity<List<RespostaFilteredDTO>> {
        val respostas = respostaService.filtrarPorCpf(cpf)
        return if (respostas.isEmpty()) {
            ResponseEntity.status(204).build()
        } else {
            ResponseEntity.ok(respostas)
        }
    }

    @Operation(summary = "Filtrar respostas por descrição da pergunta")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Lista de respostas filtradas por descrição da pergunta"),
            ApiResponse(responseCode = "204", description = "Nenhuma resposta encontrada para a descrição fornecida")
        ]
    )
    @GetMapping("/filtrar/pergunta/{nome}")
    fun filtrarPorPergunta(@Valid @PathVariable nome: String): ResponseEntity<List<RespostaFilteredDTO>> {
        val respostas = respostaService.filtrarPorPergunta(nome)
        return if (respostas.isEmpty()) {
            ResponseEntity.status(204).build()
        } else {
            ResponseEntity.ok(respostas)
        }
    }

    @Operation(summary = "Excluir uma resposta por ID")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Resposta excluída com sucesso"),
            ApiResponse(responseCode = "404", description = "Resposta não encontrada para o ID fornecido")
        ]
    )
    @DeleteMapping("/excluir/{id}")
    fun excluirResposta(@PathVariable id: Int): ResponseEntity<String> {
        return if (respostaService.excluirResposta(id)) {
            ResponseEntity.status(200).body("Resposta excluída com sucesso.")
        } else {
            ResponseEntity.status(404).body("Resposta não encontrada para o ID fornecido.")
        }
    }

    // Post Personalidade - César
    @PostMapping("/verificar-personalidade")
    fun registrarPersonalidade(@RequestBody respostasChegando: RespostaPersonalidade): ResponseEntity<String> {
        return respostaService.filtrarPersonalidade(respostasChegando)
    }

    // Patch Personalidade - César
    @PatchMapping("/atualizar-personalidade")
    fun atualizarPersonalidade(@RequestBody respostasChegando: RespostaPersonalidade): ResponseEntity<String> {
        return respostaService.filtrarPersonalidade(respostasChegando)
    }

    // Get Personalidade - César
    // @GetMapping("perguntas-personalidade")
    // fun buscarPerguntasPersonalidade(): List<Pergunta> {
    //     val perguntas = perguntaService.listarPerguntasPersonalidade()
    //    return perguntas
    // }

    // Delete Personalidade - César
    @DeleteMapping("/deletar-personalidade")
    fun deletarPersonalidade(@RequestBody respostasChegando: RespostaPersonalidade): ResponseEntity<String>{
        val resultado =  ResponseEntity.status(200).body("Personalidade apagada!") // respostaService.deletarPersonalidade
        return resultado
    }
}
package sptech.projetojpa1.controller

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import sptech.projetojpa1.dto.resposta.RespostaBatchRequestDTO
import sptech.projetojpa1.dto.resposta.RespostaFilteredDTO
import sptech.projetojpa1.dto.resposta.RespostaRequestDTO
import sptech.projetojpa1.dto.resposta.RespostaResponseDTO
import sptech.projetojpa1.service.RespostaService

@RestController
@RequestMapping("/api/respostas")
class RespostaController(
    private val respostaService: RespostaService
) {

    @Operation(
        summary = "Cadastrar uma nova resposta",
        description = "Cadastra uma nova resposta associada a uma pergunta, ficha e usuário específicos."
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "201", description = "Resposta cadastrada com sucesso"),
            ApiResponse(responseCode = "400", description = "Dados inválidos")
        ]
    )
    @PostMapping
    fun criarRespostas(@RequestBody @Valid request: RespostaBatchRequestDTO): ResponseEntity<List<RespostaResponseDTO>> {
        val respostas = respostaService.criarRespostas(request)
        return ResponseEntity.ok(respostas)
    }

    @Operation(
        summary = "Listar todas as respostas",
        description = "Retorna todas as respostas cadastradas no sistema."
    )
    @GetMapping
    fun listarRespostas(): ResponseEntity<List<RespostaResponseDTO>> {
        return ResponseEntity.ok(respostaService.listarRespostas())
    }

    @Operation(
        summary = "Buscar uma resposta por ID",
        description = "Retorna uma resposta específica pelo ID fornecido."
    )
    @GetMapping("/{id}")
    fun buscarRespostaPorId(@PathVariable id: Int): ResponseEntity<RespostaResponseDTO> {
        return ResponseEntity.ok(respostaService.buscarRespostaPorId(id))
    }

    @Operation(
        summary = "Atualizar uma resposta existente",
        description = "Atualiza os dados de uma resposta existente."
    )
    @PutMapping("/{id}")
    fun atualizarResposta(
        @PathVariable id: Int,
        @RequestBody @Valid request: RespostaRequestDTO
    ): ResponseEntity<RespostaResponseDTO> {
        return ResponseEntity.ok(respostaService.atualizarResposta(id, request))
    }

    @Operation(
        summary = "Deletar uma resposta",
        description = "Remove uma resposta existente do sistema pelo ID fornecido."
    )
    @DeleteMapping("/{id}")
    fun deletarResposta(@PathVariable id: Int): ResponseEntity<Void> {
        return if (respostaService.deletarResposta(id)) {
            ResponseEntity.noContent().build()
        } else {
            ResponseEntity.notFound().build()
        }
    }

    @Operation(
        summary = "Filtrar respostas por CPF",
        description = "Retorna as respostas associadas a um CPF específico."
    )
    @GetMapping("/cpf/{cpf}")
    fun filtrarPorCpf(@PathVariable cpf: String): ResponseEntity<List<RespostaFilteredDTO>> {
        return ResponseEntity.ok(respostaService.filtrarPorCpf(cpf))
    }
}
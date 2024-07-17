package sptech.projetojpa1.controller

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import sptech.projetojpa1.dominio.Capacitacao
import sptech.projetojpa1.dto.capacitacao.CapacitacaoDTO
import sptech.projetojpa1.dto.capacitacao.CapacitacaoPutDTO
import sptech.projetojpa1.dto.capacitacao.CapacitacaoRequestDTO
import sptech.projetojpa1.dto.capacitacao.CapacitacaoResponseDTO
import sptech.projetojpa1.service.CapacitacaoService

@RestController
@RequestMapping("/capacitacao")
class CapacitacaoController(private val service: CapacitacaoService) {

    @Operation(summary = "Criar uma nova capacitação")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "201", description = "Capacitação criada com sucesso"),
            ApiResponse(responseCode = "400", description = "Dados inválidos")
        ]
    )
    @PostMapping("/criar")
    fun criarCapacitacao(@RequestBody capacitacaoRequestDTO: CapacitacaoRequestDTO): ResponseEntity<CapacitacaoDTO> {
        val capacitacaoDTO = service.criarCapacitacao(capacitacaoRequestDTO)
        return ResponseEntity(capacitacaoDTO, HttpStatus.CREATED)
    }

    @Operation(summary = "Buscar todas as capacitações")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Lista de Capacitações"),
            ApiResponse(responseCode = "204", description = "Nenhuma capacitação encontrada")
        ]
    )
    @GetMapping("/listar")
    fun listarTodasCapacitacoes(): ResponseEntity<List<CapacitacaoResponseDTO>> {
        val capacitacoes = service.listarTodasCapacitacoes()
        return ResponseEntity(capacitacoes, HttpStatus.OK)
    }

    @Operation(summary = "Listar Capacitações Ativas")
    @ApiResponses(value = [
        ApiResponse(responseCode = "200", description = "Operação bem-sucedida. Retorna as capacitações encontradas"),
        ApiResponse(responseCode = "204", description = "Capacitações não encontradas"),
        ApiResponse(responseCode = "500", description = "Erro interno do servidor. Retorna uma mensagem de erro")
    ])
    @GetMapping("/listar-ativos")
    fun listarCapacitacoesAtivas(@RequestParam ativo: Boolean): ResponseEntity<List<Capacitacao>> {
        val capacitacoes = service.listarCapacitacoesAtivas(ativo)
        return ResponseEntity.ok(capacitacoes)
    }

    @Operation(summary = "Buscar Capacitação por Id")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Operação bem-sucedida"),
            ApiResponse(responseCode = "404", description = "Capacitação não encontrada")
        ]
    )
    @GetMapping("/buscar/{id}")
    fun buscarCapacitacaoPorId(@PathVariable idCapacitacao: Int): ResponseEntity<CapacitacaoResponseDTO> {
        val capacitacaoDTO = service.buscarCapacitacaoPorId(idCapacitacao)
        return if (capacitacaoDTO != null) {
            ResponseEntity(capacitacaoDTO, HttpStatus.OK)
        } else {
            ResponseEntity(HttpStatus.NOT_FOUND)
        }
    }

    @Operation(summary = "Atualizar Capacitação")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Capacitação atualizada com sucesso"),
            ApiResponse(responseCode = "404", description = "Capacitação não encontrada"),
            ApiResponse(responseCode = "400", description = "Dados inválidos")
        ]
    )
    @PutMapping("/atualizar/{id}")
    fun atualizarCapacitacao(
        @PathVariable id: Int,
        @RequestBody capacitacaoRequestDTO: CapacitacaoPutDTO
    ): ResponseEntity<CapacitacaoResponseDTO> {
        val capacitacaoDTO = service.atualizarCapacitacao(id, capacitacaoRequestDTO)
        return if (capacitacaoDTO != null) {
            ResponseEntity(capacitacaoDTO, HttpStatus.OK)
        } else {
            ResponseEntity(HttpStatus.NOT_FOUND)
        }
    }

    @Operation(summary = "Desativar Capacitação")
    @ApiResponses(value = [
        ApiResponse(responseCode = "200", description = "Operação bem-sucedida."),
        ApiResponse(responseCode = "404", description = "Capacitação não encontrada"),
        ApiResponse(responseCode = "500", description = "Erro interno do servidor. Retorna uma mensagem de erro")
    ])
    @PatchMapping("/desativar-capacitacao/{id}")
    fun desativarCapacitacao(@Valid @PathVariable id: Int): ResponseEntity<Any> {
        val capacitacaoAtualizada = service.alterarStatusCapacitacao(id, false)
        return if (capacitacaoAtualizada != null) {
            ResponseEntity.status(200).body(capacitacaoAtualizada)
        } else {
            ResponseEntity.status(404).body("Capacitação não encontrada para ser desativada")
        }
    }

    @Operation(summary = "Ativar Capacitação")
    @ApiResponses(value = [
        ApiResponse(responseCode = "200", description = "Operação bem-sucedida. Retorna a capacitação ativada"),
        ApiResponse(responseCode = "404", description = "Capacitação não encontrada"),
        ApiResponse(responseCode = "500", description = "Erro interno do servidor. Retorna uma mensagem de erro")
    ])
    @PatchMapping("/ativar-capacitacao/{id}")
    fun ativarCapacitacao(@Valid @PathVariable id: Int): ResponseEntity<Any> {
        val capacitacaoAtualizada = service.alterarStatusCapacitacao(id, true)
        return if (capacitacaoAtualizada != null) {
            ResponseEntity.status(200).body(capacitacaoAtualizada)
        } else {
            ResponseEntity.status(404).body("Capacitação não encontrada")
        }
    }

    @Operation(summary = "Excluir Capacitação pelo ID")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Capacitação excluída com sucesso"),
            ApiResponse(responseCode = "404", description = "Capacitação não encontrada")
        ]
    )
    @DeleteMapping("/excluir/{id}")
    fun excluirCapacitacao(@PathVariable id: Int): ResponseEntity<String> {
        service.excluirCapacitacao(id)
        return ResponseEntity.ok("Capacitação excluída com sucesso")
    }
}








package sptech.projetojpa1.controller

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

import sptech.projetojpa1.dominio.TempoProcedimento
import sptech.projetojpa1.dto.tempo.TempoProcedimentoRequest
import sptech.projetojpa1.service.TempoProcedimentoService

@RestController
@RequestMapping("/api/tempos")
class TempoProcedimentoController(private val service: TempoProcedimentoService) {

    @Operation(summary = "Listar todos os tempos de procedimento")
    @ApiResponses(value = [
        ApiResponse(responseCode = "200", description = "Operação bem-sucedida"),
        ApiResponse(responseCode = "204", description = "Nenhum tempo de procedimento encontrado"),
        ApiResponse(responseCode = "500", description = "Erro interno do servidor. Retorna uma mensagem de erro")
    ])
    @GetMapping
    fun listarTodos(): ResponseEntity<List<TempoProcedimento>> {
        val tempos = service.listarTodos()
        return if (tempos.isNotEmpty()) {
            ResponseEntity.ok(tempos)
        } else {
            ResponseEntity.noContent().build()
        }
    }


    @Operation(summary = "Cadastrar novo tempo de procedimento")
    @ApiResponses(value = [
        ApiResponse(responseCode = "201", description = "Recurso criado com sucesso. Retorna o tempo de procedimento cadastrado"),
        ApiResponse(responseCode = "400", description = "Requisição inválida. Retorna uma mensagem de erro"),
        ApiResponse(responseCode = "500", description = "Erro interno do servidor. Retorna uma mensagem de erro")
    ])
    @PostMapping("/cadastro-tempo-procedimento")
    fun cadastrar(@Valid @RequestBody dto: TempoProcedimentoRequest): ResponseEntity<TempoProcedimento> {
        val tempoSalvo = service.cadastrar(dto)
        return ResponseEntity.status(201).body(tempoSalvo)
    }

    @Operation(summary = "Deletar tempos de procedimento por especificação")
    @ApiResponses(value = [
        ApiResponse(responseCode = "200", description = "Operação bem-sucedida"),
        ApiResponse(responseCode = "404", description = "Tempo de procedimento não encontrado"),
        ApiResponse(responseCode = "500", description = "Erro interno do servidor. Retorna uma mensagem de erro")
    ])
    @DeleteMapping("/exclusao-por-id/{id}")
    fun deletarPorEspecificacao(@RequestParam id: Int): ResponseEntity<Void> {
        service.deletar(id)
        return ResponseEntity.ok().build()
    }

    @Operation(summary = "Editar tempo de procedimento")
    @ApiResponses(value = [
        ApiResponse(responseCode = "200", description = "Tempo de procedimento atualizado com sucesso"),
        ApiResponse(responseCode = "404", description = "Tempo de procedimento não encontrado")
    ])
    @PatchMapping("/{id}")
    fun editar(@PathVariable id: Int, @Valid @RequestBody dto: TempoProcedimentoRequest): ResponseEntity<TempoProcedimento> {
        val tempoAtualizado = service.editar(id, dto)
        return if (tempoAtualizado != null) {
            ResponseEntity.ok(tempoAtualizado)
        } else {
            ResponseEntity.notFound().build()
        }
    }
}

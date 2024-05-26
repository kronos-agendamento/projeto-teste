// Importações necessárias
package sptech.projetojpa1.controller

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import sptech.projetojpa1.dominio.Procedimento
import sptech.projetojpa1.dto.ProcedimentoDTO
import sptech.projetojpa1.service.ProcedimentoService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses

// Controlador para os endpoints relacionados a procedimentos
@RestController
@RequestMapping("/procedimentos")
class ProcedimentoController(private val procedimentoService: ProcedimentoService) {

    // Operação para obter todos os procedimentos
    @Operation(summary = "Obter todos os procedimentos")
    @GetMapping
    fun getAllProcedimentos(): ResponseEntity<Any> {
        return try {
            // Tenta obter todos os procedimentos e mapeá-los para DTOs
            val procedimentos = procedimentoService.findAll().map { it.toDTO() }
            ResponseEntity.ok(procedimentos) // Retorna a lista de procedimentos com status OK
        } catch (ex: Exception) {
            // Em caso de erro, retorna uma resposta de erro interno do servidor com a mensagem de erro
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Erro ao processar a solicitação: ${ex.message}")
        }
    }

    // Operação para obter um procedimento por ID
    @Operation(summary = "Obter procedimento por ID")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Procedimento encontrado"),
            ApiResponse(responseCode = "404", description = "Procedimento não encontrado")
        ]
    )
    @GetMapping("/{id}")
    fun getProcedimentoById(@PathVariable id: Int): ResponseEntity<Any> {
        return try {
            // Tenta obter o procedimento pelo ID e converte para DTO
            val procedimento = procedimentoService.findById(id)?.toDTO()
            procedimento?.let { ResponseEntity.ok(it) } ?: ResponseEntity.notFound().build()
        } catch (ex: Exception) {
            // Em caso de erro, retorna uma resposta de erro interno do servidor com a mensagem de erro
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Erro ao processar a solicitação: ${ex.message}")
        }
    }

    // Operação para criar um novo procedimento
    @Operation(summary = "Criar um novo procedimento")
    @PostMapping
    fun createProcedimento(@RequestBody procedimentoDTO: ProcedimentoDTO): ResponseEntity<Any> {
        return try {
            // Tenta salvar o novo procedimento e retorna o DTO com status CREATED
            val procedimento = procedimentoService.save(procedimentoDTO.toEntity())
            ResponseEntity(procedimento.toDTO(), HttpStatus.CREATED)
        } catch (ex: Exception) {
            // Em caso de erro, retorna uma resposta de erro interno do servidor com a mensagem de erro
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Erro ao processar a solicitação: ${ex.message}")
        }
    }

    // Operação para atualizar um procedimento existente
    @Operation(summary = "Atualizar um procedimento existente")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Procedimento atualizado"),
            ApiResponse(responseCode = "404", description = "Procedimento não encontrado")
        ]
    )
    @PutMapping("/{id}")
    fun updateProcedimento(
        @PathVariable id: Int,
        @RequestBody procedimentoDTO: ProcedimentoDTO
    ): ResponseEntity<Any> {
        return try {
            // Tenta atualizar o procedimento e retorna o DTO atualizado
            val updatedProcedimento = procedimentoService.update(id, procedimentoDTO.toEntity())
            ResponseEntity.ok(updatedProcedimento.toDTO())
        } catch (ex: Exception) {
            // Em caso de erro, retorna uma resposta de erro interno do servidor com a mensagem de erro
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Erro ao processar a solicitação: ${ex.message}")
        }
    }

    // Operação para excluir um procedimento
    @Operation(summary = "Excluir um procedimento")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "204", description = "Procedimento excluído"),
            ApiResponse(responseCode = "404", description = "Procedimento não encontrado")
        ]
    )
    @DeleteMapping("/{id}")
    fun deleteProcedimento(@PathVariable id: Int): ResponseEntity<Any> {
        return try {
            // Tenta excluir o procedimento e retorna uma resposta vazia com status NO_CONTENT
            procedimentoService.delete(id)
            ResponseEntity.noContent().build()
        } catch (ex: Exception) {
            // Em caso de erro, retorna uma resposta de erro interno do servidor com a mensagem de erro
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Erro ao processar a solicitação: ${ex.message}")
        }
    }

    // Função de extensão para converter Procedimento para ProcedimentoDTO
    private fun Procedimento.toDTO() = ProcedimentoDTO(id, descricao)

    // Função de extensão para converter ProcedimentoDTO para Procedimento
    private fun ProcedimentoDTO.toEntity() = Procedimento(id, descricao)
}

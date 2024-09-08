package sptech.projetojpa1.controller

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import sptech.projetojpa1.dto.status.StatusRequest
import sptech.projetojpa1.dto.status.StatusResponse
import sptech.projetojpa1.service.StatusService

@RestController
@RequestMapping("/status-agendamento")
class StatusController(private val statusService: StatusService) {

    @Operation(summary = "Cadastrar novo status de agendamento")
    @ApiResponses(value = [
        ApiResponse(responseCode = "201", description = "Recurso criado com sucesso. Retorna o status cadastrado"),
        ApiResponse(responseCode = "400", description = "Requisição inválida. Retorna uma mensagem de erro"),
        ApiResponse(responseCode = "500", description = "Erro interno do servidor. Retorna uma mensagem de erro")
    ])
    // Cadastro de Novo Status
    @PostMapping("/cadastro-status")
    fun cadastrarStatus(@Valid @RequestBody novoStatus: StatusRequest): ResponseEntity<String> {
        val statusSalvo = statusService.createStatus(novoStatus)
        return ResponseEntity.status(201).body("Status ${statusSalvo.nome} cadastrado com sucesso")
    }


    @Operation(summary = "Listar todos os status")
    @ApiResponses(value = [
        ApiResponse(responseCode = "200", description = "Operação bem-sucedida. Retorna uma lista de status"),
        ApiResponse(responseCode = "204", description = "Requisição bem-sucedida, mas não há conteúdo para ser exibido. Retorna uma resposta vazia"),
        ApiResponse(responseCode = "500", description = "Erro interno do servidor. Retorna uma mensagem de erro")
    ])
    @GetMapping
    fun listarTodosStatus(): ResponseEntity<Any> {
        val lista = statusService.getAllStatuses()
        return if (lista.isNotEmpty()) {
            ResponseEntity.status(200).body(lista)
        } else {
            ResponseEntity.status(204).body("Infelizmente nenhum cadastro de status foi realizado ainda.")
        }
    }

    @Operation(summary = "Listar status por id")
    @ApiResponses(value = [
        ApiResponse(responseCode = "200", description = "Operação bem-sucedida. Retorna o status encontrado"),
        ApiResponse(responseCode = "404", description = "Status não encontrado"),
        ApiResponse(responseCode = "500", description = "Erro interno do servidor. Retorna uma mensagem de erro")
    ])
    @GetMapping("/filtro-por-id/{id}")
    fun filtrarStatusPorId(@PathVariable id: Int): ResponseEntity<StatusResponse> {
        val statusDTO = statusService.getStatusById(id) ?: return ResponseEntity.status(404).build()
        return ResponseEntity.ok(statusDTO)
    }

    @Operation(summary = "Deletar status por id")
    @ApiResponses(value = [
        ApiResponse(responseCode = "200", description = "Operação bem-sucedida"),
        ApiResponse(responseCode = "404", description = "Status não encontrado"),
        ApiResponse(responseCode = "500", description = "Erro interno do servidor. Retorna uma mensagem de erro")
    ])
    @DeleteMapping("/exclusao-por-id/{id}")
    fun excluirStatus(@PathVariable id: Int): ResponseEntity<Any> {
        return if (statusService.deleteStatus(id)) {
            ResponseEntity.status(200).body("Status deletado com sucesso.")
        } else {
            ResponseEntity.status(404).body("Não encontramos o status pesquisado.")
        }
    }

    @Operation(summary = "Editar status")
    @ApiResponses(value = [
        ApiResponse(responseCode = "200", description = "Operação bem-sucedida. Retorna o status atualizado"),
        ApiResponse(responseCode = "404", description = "Status não encontrado"),
        ApiResponse(responseCode = "500", description = "Erro interno do servidor. Retorna uma mensagem de erro")
    ])
    @PatchMapping("atualizacao-status/{id}")
    fun editarStatus(@PathVariable id: Int, @Valid @RequestBody patchRequest: StatusRequest): ResponseEntity<Any> {
        return try {
            val updatedStatus = statusService.updateStatus(id, patchRequest)
            ResponseEntity.ok(updatedStatus)
        } catch (e: IllegalArgumentException) {
            ResponseEntity.status(400).body(e.message)
        } catch (e: NoSuchElementException) {
            ResponseEntity.status(404).body("Status inexistente no nosso sistema.")
        }
    }
}
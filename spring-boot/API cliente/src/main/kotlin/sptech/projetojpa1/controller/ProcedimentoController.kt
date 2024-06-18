package sptech.projetojpa1.controller

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import sptech.projetojpa1.dto.procedimento.ProcedimentoDTO
import sptech.projetojpa1.dto.procedimento.ProcedimentoEstatisticaDTO
import sptech.projetojpa1.dto.procedimento.ProcedimentoRequestDTO
import sptech.projetojpa1.dto.procedimento.ProcedimentoResponseDTO
import sptech.projetojpa1.service.ProcedimentoService

@RestController
@RequestMapping("/api/procedimentos")
class ProcedimentoController(private val procedimentoService: ProcedimentoService) {

    @Operation(summary = "Criar um novo procedimento")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "201", description = "Procedimento criado com sucesso"),
            ApiResponse(responseCode = "400", description = "Dados inválidos")
        ]
    )
    @PostMapping("/criar")
    fun criarProcedimento(@RequestBody procedimentoRequestDTO: ProcedimentoRequestDTO): ResponseEntity<ProcedimentoDTO> {
        val procedimentoDTO = procedimentoService.criarProcedimento(procedimentoRequestDTO)
        return ResponseEntity(procedimentoDTO, HttpStatus.CREATED)
    }

    @Operation(summary = "Buscar procedimento por ID")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Operação bem sucedida"),
            ApiResponse(responseCode = "404", description = "Procedimento não encontrado")
        ]
    )
    @GetMapping("/buscar/{id}")
    fun buscarProcedimentoPorId(@PathVariable id: Int): ResponseEntity<ProcedimentoResponseDTO> {
        val procedimentoDTO = procedimentoService.buscarProcedimentoPorId(id)
        return if (procedimentoDTO != null) {
            ResponseEntity(procedimentoDTO, HttpStatus.OK)
        } else {
            ResponseEntity(HttpStatus.NOT_FOUND)
        }
    }

    @Operation(summary = "Buscar todos os procedimentos")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Lista de procedimentos"),
            ApiResponse(responseCode = "204", description = "Nenhum procedimento encontrado")
        ]
    )
    @GetMapping("/listar")
    fun listarTodosProcedimentos(): ResponseEntity<List<ProcedimentoResponseDTO>> {
        val procedimentos = procedimentoService.listarTodosProcedimentos()
        return ResponseEntity(procedimentos, HttpStatus.OK)
    }

    @Operation(summary = "Atualizar procedimento")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Procedimento atualizado com sucesso"),
            ApiResponse(responseCode = "404", description = "Procedimento não encontrado"),
            ApiResponse(responseCode = "400", description = "Dados inválidos")
        ]
    )
    @PutMapping("/atualizar/{id}")
    fun atualizarProcedimento(
        @PathVariable id: Int,
        @RequestBody procedimentoRequestDTO: ProcedimentoRequestDTO
    ): ResponseEntity<ProcedimentoResponseDTO> {
        val procedimentoDTO = procedimentoService.atualizarProcedimento(id, procedimentoRequestDTO)
        return if (procedimentoDTO != null) {
            ResponseEntity(procedimentoDTO, HttpStatus.OK)
        } else {
            ResponseEntity(HttpStatus.NOT_FOUND)
        }
    }

    @Operation(summary = "Deletar procedimento")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "204", description = "Procedimento deletado com sucesso"),
            ApiResponse(responseCode = "404", description = "Procedimento não encontrado")
        ]
    )
    @DeleteMapping("/deletar/{id}")
    fun deletarProcedimento(@PathVariable id: Int): ResponseEntity<Any> {
        val deleted = procedimentoService.deletarProcedimento(id)
        return if (deleted) {
            ResponseEntity(HttpStatus.NO_CONTENT)
        } else {
            ResponseEntity(HttpStatus.NOT_FOUND)
        }
    }

    @GetMapping("/mais-agendado")
    fun getProcedimentoMaisAgendado(): ResponseEntity<ProcedimentoEstatisticaDTO> {
        val procedimento = procedimentoService.getProcedimentoMaisAgendado()
        return if (procedimento != null) {
            ResponseEntity(procedimento, HttpStatus.OK)
        } else {
            ResponseEntity(HttpStatus.NO_CONTENT)
        }
    }

    @GetMapping("/menos-agendado")
    fun getProcedimentoMenosAgendado(): ResponseEntity<ProcedimentoEstatisticaDTO> {
        val procedimento = procedimentoService.getProcedimentoMenosAgendado()
        return if (procedimento != null) {
            ResponseEntity(procedimento, HttpStatus.OK)
        } else {
            ResponseEntity(HttpStatus.NO_CONTENT)
        }
    }

    @GetMapping("/melhor-nota")
    fun getProcedimentoComMelhorNota(): ResponseEntity<ProcedimentoEstatisticaDTO> {
        val procedimento = procedimentoService.getProcedimentoComMelhorNota()
        return if (procedimento != null) {
            ResponseEntity(procedimento, HttpStatus.OK)
        } else {
            ResponseEntity(HttpStatus.NO_CONTENT)
        }
    }
}   
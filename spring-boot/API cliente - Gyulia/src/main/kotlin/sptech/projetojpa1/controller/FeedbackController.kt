package sptech.projetojpa1.controller

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import sptech.projetojpa1.dto.feedback.FeedbackRequestDTO
import sptech.projetojpa1.dto.feedback.FeedbackResponseDTO
import sptech.projetojpa1.service.FeedbackService

@RestController
@RequestMapping("/api/feedbacks")
class FeedbackController(private val feedbackService: FeedbackService) {

    @Operation(summary = "Cria um novo feedback")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "201", description = "Feedback criado com sucesso"),
            ApiResponse(responseCode = "400", description = "Solicitação inválida")
        ]
    )
    @PostMapping("/criar")
    fun criarNovoFeedback(@RequestBody feedbackRequestDTO: FeedbackRequestDTO): ResponseEntity<FeedbackResponseDTO> {
        val feedbackResponseDTO = feedbackService.criarFeedback(feedbackRequestDTO)
        return ResponseEntity(feedbackResponseDTO, HttpStatus.CREATED)
    }

    @Operation(summary = "Buscar feedback por ID")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Operação bem sucedida"),
            ApiResponse(responseCode = "404", description = "Feedback não encontrado")
        ]
    )
    @GetMapping("/buscar/{id}")
    fun buscarFeedbackPorId(@PathVariable id: Int): ResponseEntity<FeedbackResponseDTO> {
        val feedbackResponseDTO = feedbackService.buscarFeedbackPorId(id) ?: return ResponseEntity(HttpStatus.NOT_FOUND)
        return ResponseEntity(feedbackResponseDTO, HttpStatus.OK)
    }

    @Operation(summary = "Atualizar feedback")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Feedback atualizado com sucesso"),
            ApiResponse(responseCode = "404", description = "Feedback não encontrado"),
            ApiResponse(responseCode = "400", description = "Solicitação inválida")
        ]
    )
    @PutMapping("/atualizar/{id}")
    fun atualizarFeedbackExistente(
        @PathVariable id: Int,
        @RequestBody feedbackRequestDTO: FeedbackRequestDTO
    ): ResponseEntity<FeedbackResponseDTO> {
        val feedbackResponseDTO =
            feedbackService.atualizarFeedback(id, feedbackRequestDTO) ?: return ResponseEntity(HttpStatus.NOT_FOUND)
        return ResponseEntity(feedbackResponseDTO, HttpStatus.OK)
    }

    @Operation(summary = "Deletar feedback")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "204", description = "Feedback deletado com sucesso"),
            ApiResponse(responseCode = "404", description = "Feedback não encontrado")
        ]
    )
    @DeleteMapping("/deletar/{id}")
    fun deletarFeedbackExistente(@PathVariable id: Int): ResponseEntity<Void> {
        feedbackService.deletarFeedback(id)
        return ResponseEntity(HttpStatus.NO_CONTENT)
    }
}
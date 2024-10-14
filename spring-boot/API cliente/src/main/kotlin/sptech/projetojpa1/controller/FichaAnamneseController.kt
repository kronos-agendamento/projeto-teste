package sptech.projetojpa1.controller

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import sptech.projetojpa1.dto.FichaCompletaResponseDTO
import sptech.projetojpa1.dto.FichaRequest
import sptech.projetojpa1.service.FichaAnamneseService

@RestController
@RequestMapping("/api/ficha-anamnese")
class FichaAnamneseController(
    val fichaAnamneseService: FichaAnamneseService
) {

    @Operation(
        summary = "Cadastrar nova ficha de anamnese",
        description = "Cria uma nova ficha de anamnese com base nas informações fornecidas. Retorna a ficha criada com sucesso."
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "201", description = "Recurso criado com sucesso. Retorna a ficha cadastrada"),
            ApiResponse(
                responseCode = "400",
                description = "Requisição inválida. Retorna uma mensagem de erro indicando quais dados estão incorretos"
            ),
            ApiResponse(
                responseCode = "500",
                description = "Erro interno do servidor. Retorna uma mensagem de erro geral"
            )
        ]
    )
    @PostMapping
    fun cadastrarFichaAnamnese(@RequestBody @Valid novaFichaAnamneseDTO: FichaRequest): ResponseEntity<FichaCompletaResponseDTO> {
        val fichaAnamneseSalva = fichaAnamneseService.cadastrarFichaAnamnese(novaFichaAnamneseDTO)
        return ResponseEntity.status(201).body(fichaAnamneseSalva)
    }

    @Operation(
        summary = "Listar todas as fichas de anamnese",
        description = "Retorna uma lista de todas as fichas de anamnese cadastradas. Caso não haja fichas cadastradas, retorna uma resposta vazia com o status 204."
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Operação bem-sucedida. Retorna uma lista de fichas de anamnese"
            ),
            ApiResponse(
                responseCode = "204",
                description = "Requisição bem-sucedida, mas não há conteúdo para ser exibido. Retorna uma resposta vazia"
            ),
            ApiResponse(
                responseCode = "500",
                description = "Erro interno do servidor. Retorna uma mensagem de erro geral"
            )
        ]
    )
    @GetMapping
    fun listarFichasAnamnese(): ResponseEntity<List<FichaCompletaResponseDTO>> {
        val fichas = fichaAnamneseService.listarFichasAnamnese()
        return if (fichas.isEmpty()) {
            ResponseEntity.status(204).build()
        } else {
            ResponseEntity.status(200).body(fichas)
        }
    }
}

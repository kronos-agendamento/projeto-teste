package sptech.projetojpa1.controller

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import sptech.projetojpa1.dto.FichaRequest
import sptech.projetojpa1.dto.FichaResponse
import sptech.projetojpa1.service.FichaAnamneseService

@RestController
@RequestMapping("/ficha")
class FichaAnamneseController(
    val fichaAnamneseService: FichaAnamneseService
) {
    // Endpoint para cadastrar uma nova ficha de anamnese

    @Operation(summary = "Cadastrar nova ficha de anamnese")
    @ApiResponses(value = [
        ApiResponse(responseCode = "201", description = "Recurso criado com sucesso. Retorna a ficha cadastrada"),
        ApiResponse(responseCode = "400", description = "Requisição inválida. Retorna uma mensagem de erro"),
        ApiResponse(responseCode = "500", description = "Erro interno do servidor. Retorna uma mensagem de erro")
    ])
    @PostMapping("/cadastro-ficha-anamnese")
    fun cadastrarFichaAnamnese(@RequestBody @Valid novaFichaAnamneseDTO: FichaRequest): ResponseEntity<FichaResponse> {
        val fichaAnamneseSalva = fichaAnamneseService.cadastrarFichaAnamnese(novaFichaAnamneseDTO)
        return ResponseEntity.status(201).body(fichaAnamneseSalva)
    }

    // Endpoint para listar todas as fichas de anamnese
    @Operation(summary = "Listar todas as fichas de anamnese")
    @ApiResponses(value = [
        ApiResponse(responseCode = "200", description = "Operação bem-sucedida. Retorna uma lista de fichas de anamnese"),
        ApiResponse(responseCode = "204", description = "Requisição bem-sucedida, mas não há conteúdo para ser exibido. Retorna uma resposta vazia"),
        ApiResponse(responseCode = "500", description = "Erro interno do servidor. Retorna uma mensagem de erro")
    ])
    @GetMapping("/lista-ficha")
    fun listarFichasAnamnese(): ResponseEntity<List<FichaResponse>> {
        val fichas = fichaAnamneseService.listarFichasAnamnese()
        return if (fichas.isEmpty()) {
            ResponseEntity.status(204).build()
        } else {
            ResponseEntity.status(200).body(fichas)
        }
    }


}

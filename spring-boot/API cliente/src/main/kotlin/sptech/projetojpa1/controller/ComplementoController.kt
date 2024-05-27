package sptech.projetojpa1.controller

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import sptech.projetojpa1.dto.complemento.ComplementoRequestDTO
import sptech.projetojpa1.dto.complemento.ComplementoResponseDTO
import sptech.projetojpa1.dto.complemento.ComplementoUpdateDTO
import sptech.projetojpa1.service.ComplementoService

@RestController
@RequestMapping("/api/complementos")
class ComplementoController(
    private val complementoService: ComplementoService
) {

    @Operation(summary = "Cadastra um novo complemento")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "201", description = "Complemento criado com sucesso"),
            ApiResponse(responseCode = "400", description = "Dados de entrada inválidos")
        ]
    )
    @PostMapping("/cadastrar")
    fun cadastrarNovoComplemento(@RequestBody @Valid dto: ComplementoRequestDTO): ResponseEntity<ComplementoResponseDTO> {
        val complemento = complementoService.cadastrarComplemento(dto)
        return ResponseEntity.status(201).body(complemento)
    }

    @Operation(summary = "Obtém um complemento pelo ID")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Complemento encontrado"),
            ApiResponse(responseCode = "404", description = "Complemento não encontrado")
        ]
    )
    @GetMapping("/buscar/{id}")
    fun obterComplementoPorId(@PathVariable id: Int): ResponseEntity<ComplementoResponseDTO> {
        val complemento = complementoService.obterComplementoPorId(id)
        return ResponseEntity.ok(complemento)
    }

    @Operation(summary = "Obtém complementos por ID de endereço")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Complementos encontrados"),
            ApiResponse(responseCode = "404", description = "Nenhum complemento encontrado para o endereço fornecido")
        ]
    )
    @GetMapping("/buscar-por-endereco/{enderecoId}")
    fun obterComplementosPorIdEndereco(@PathVariable enderecoId: Int): ResponseEntity<List<ComplementoResponseDTO>> {
        val complementos = complementoService.obterComplementosPorIdEndereco(enderecoId)
        return if (complementos.isEmpty()) {
            ResponseEntity.status(404).body(complementos)
        } else {
            ResponseEntity.ok(complementos)
        }
    }

    @Operation(summary = "Edita um complemento pelo ID")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Complemento atualizado com sucesso"),
            ApiResponse(responseCode = "404", description = "Complemento não encontrado")
        ]
    )
    @PatchMapping("/editar/{id}")
    fun editarComplemento(
        @PathVariable id: Int,
        @RequestBody @Valid dto: ComplementoUpdateDTO
    ): ResponseEntity<ComplementoResponseDTO> {
        val complemento = complementoService.editarComplemento(id, dto)
        return ResponseEntity.ok(complemento)
    }

    @Operation(summary = "Exclui um complemento pelo ID")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Complemento excluído com sucesso"),
            ApiResponse(responseCode = "404", description = "Complemento não encontrado")
        ]
    )
    @DeleteMapping("/excluir/{id}")
    fun excluirComplemento(@PathVariable id: Int): ResponseEntity<String> {
        complementoService.excluirComplemento(id)
        return ResponseEntity.ok("Complemento excluído com sucesso")
    }
}
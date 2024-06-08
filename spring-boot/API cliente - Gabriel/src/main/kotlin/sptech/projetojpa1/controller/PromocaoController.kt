package sptech.projetojpa1.controller


import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import sptech.projetojpa1.dto.promocao.PromocaoRequestDTO
import sptech.projetojpa1.dto.promocao.PromocaoResponseDTO
import sptech.projetojpa1.service.PromocaoService

@RestController
@RequestMapping("/api/promocoes")
class PromocaoController(private val promocaoService: PromocaoService) {

    @Operation(summary = "Listar todas as promoções")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Lista de promoções"),
            ApiResponse(responseCode = "204", description = "Nenhuma promoção encontrada")
        ]
    )
    @GetMapping
    fun getAllPromocoes(): ResponseEntity<List<PromocaoResponseDTO>> =
        ResponseEntity.ok(promocaoService.getAllPromocoes())

    @Operation(summary = "Obter uma promoção pelo ID")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Promoção encontrada"),
            ApiResponse(responseCode = "404", description = "Promoção não encontrada")
        ]
    )
    @GetMapping("/{id}")
    fun getPromocaoById(@PathVariable id: Int): ResponseEntity<PromocaoResponseDTO> =
        ResponseEntity.ok(promocaoService.getPromocaoById(id))

    @Operation(summary = "Criar uma nova promoção")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "201", description = "Promoção criada com sucesso"),
            ApiResponse(responseCode = "400", description = "Requisição inválida")
        ]
    )
    @PostMapping
    fun createPromocao(@RequestBody requestDTO: PromocaoRequestDTO): ResponseEntity<PromocaoResponseDTO> =
        ResponseEntity.status(HttpStatus.CREATED).body(promocaoService.createPromocao(requestDTO))

    @Operation(summary = "Atualizar uma promoção existente")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Promoção atualizada com sucesso"),
            ApiResponse(responseCode = "404", description = "Promoção não encontrada"),
            ApiResponse(responseCode = "400", description = "Requisição inválida")
        ]
    )
    @PutMapping("/{id}")
    fun updatePromocao(@PathVariable id: Int, @RequestBody requestDTO: PromocaoRequestDTO): ResponseEntity<PromocaoResponseDTO> =
        ResponseEntity.ok(promocaoService.updatePromocao(id, requestDTO))

    @Operation(summary = "Deletar uma promoção pelo ID")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "204", description = "Promoção deletada com sucesso"),
            ApiResponse(responseCode = "404", description = "Promoção não encontrada")
        ]
    )
    @DeleteMapping("/{id}")
    fun deletePromocao(@PathVariable id: Int): ResponseEntity<Void> {
        promocaoService.deletePromocao(id)
        return ResponseEntity.noContent().build()
    }
}

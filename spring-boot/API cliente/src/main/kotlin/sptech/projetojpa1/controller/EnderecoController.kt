package sptech.projetojpa1.controller

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import sptech.projetojpa1.dto.endereco.EnderecoRequestDTO
import sptech.projetojpa1.dto.endereco.EnderecoResponseDTO
import sptech.projetojpa1.service.EnderecoService

@RestController
@RequestMapping("/api/enderecos")
class EnderecoController(
    private val enderecoService: EnderecoService
) {

    @Operation(
        summary = "Lista todos os endereços",
        description = "Retorna uma lista de todos os endereços cadastrados no sistema."
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Endereços listados com sucesso"),
            ApiResponse(responseCode = "204", description = "Nenhum endereço encontrado")
        ]
    )
    @GetMapping
    fun listarEnderecos(): ResponseEntity<List<EnderecoResponseDTO>> {
        val enderecos = enderecoService.listarEnderecos()
        return if (enderecos.isNotEmpty()) {
            ResponseEntity.ok(enderecos)
        } else {
            ResponseEntity.noContent().build()
        }
    }

    @Operation(
        summary = "Busca endereços por CEP",
        description = "Retorna uma lista de endereços que correspondem ao CEP fornecido."
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Endereços encontrados"),
            ApiResponse(responseCode = "204", description = "Nenhum endereço encontrado")
        ]
    )
    @GetMapping("/{cep}")
    fun buscarEnderecosPorCEP(@PathVariable cep: String): ResponseEntity<List<EnderecoResponseDTO>> {
        val enderecos = enderecoService.buscarEnderecosPorCep(cep)
        return if (enderecos.isNotEmpty()) {
            ResponseEntity.ok(enderecos)
        } else {
            ResponseEntity.noContent().build()
        }
    }

    @Operation(
        summary = "Cria um novo endereço",
        description = "Cria um novo endereço com base nos dados fornecidos."
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "201", description = "Endereço criado com sucesso"),
            ApiResponse(responseCode = "400", description = "Dados inválidos fornecidos para criar o endereço")
        ]
    )
    @PostMapping
    fun criarEndereco(@RequestBody @Valid enderecoDTO: EnderecoRequestDTO): ResponseEntity<EnderecoResponseDTO> {
        val novoEndereco = enderecoService.criarEndereco(enderecoDTO)
        return ResponseEntity.status(201).body(novoEndereco)
    }

    @Operation(
        summary = "Atualiza um endereço existente",
        description = "Atualiza os dados de um endereço existente com base no ID fornecido."
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Endereço atualizado com sucesso"),
            ApiResponse(responseCode = "404", description = "Endereço não encontrado"),
            ApiResponse(responseCode = "400", description = "Dados inválidos fornecidos para atualizar o endereço")
        ]
    )
    @PutMapping("/{id}")
    fun atualizarEndereco(
        @PathVariable id: Int,
        @RequestBody @Valid enderecoDTO: EnderecoRequestDTO
    ): ResponseEntity<EnderecoResponseDTO> {
        val enderecoAtualizado = enderecoService.atualizarEndereco(id, enderecoDTO)
        return enderecoAtualizado?.let {
            ResponseEntity.ok(it)
        } ?: ResponseEntity.notFound().build()
    }

    @Operation(
        summary = "Exclui um endereço pelo ID",
        description = "Exclui um endereço existente com base no ID fornecido."
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Endereço excluído com sucesso"),
            ApiResponse(responseCode = "404", description = "Endereço não encontrado")
        ]
    )
    @DeleteMapping("/{id}")
    fun excluirEndereco(@PathVariable id: Int): ResponseEntity<Void> {
        return if (enderecoService.deletarEndereco(id)) {
            ResponseEntity.ok().build()
        } else {
            ResponseEntity.notFound().build()
        }
    }

}
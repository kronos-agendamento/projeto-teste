package sptech.projetojpa1.controller

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import jakarta.validation.Valid
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

    @Operation(summary = "Cadastra um novo endereço")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "201", description = "Endereço cadastrado com sucesso"),
            ApiResponse(responseCode = "400", description = "Dados de entrada inválidos")
        ]
    )
    @PostMapping("/cadastrar")
    fun cadastrarNovoEndereco(@RequestBody @Valid novoEnderecoDTO: EnderecoRequestDTO): ResponseEntity<EnderecoResponseDTO> {
        val enderecoSalvo = enderecoService.cadastrarEndereco(novoEnderecoDTO)
        return ResponseEntity.status(201).body(enderecoSalvo)
    }

    @Operation(summary = "Lista todos os endereços")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Endereços listados com sucesso"),
            ApiResponse(responseCode = "204", description = "Nenhum endereço encontrado")
        ]
    )
    @GetMapping("/listar")
    fun listarTodosEnderecos(): ResponseEntity<Any> {
        val lista = enderecoService.listarTodosEnderecos()
        return if (lista.isNotEmpty()) {
            ResponseEntity.status(200).body(lista)
        } else {
            ResponseEntity.status(204).body("Nenhum endereço foi encontrado.")
        }
    }

    @Operation(summary = "Lista endereço por código")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Endereço encontrado"),
            ApiResponse(responseCode = "404", description = "Endereço não encontrado para o código fornecido")
        ]
    )
    @GetMapping("/buscar-por-codigo/{codigo}")
    fun buscarEnderecoPorCodigo(@PathVariable codigo: Int): ResponseEntity<Any> {
        val endereco = enderecoService.buscarEnderecoPorCodigo(codigo)
        return if (endereco != null) {
            ResponseEntity.status(200).body(endereco)
        } else {
            ResponseEntity.status(404).body("Endereço não encontrado para o ID fornecido")
        }
    }

    @Operation(summary = "Lista endereços por CEP")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Endereços encontrados"),
            ApiResponse(responseCode = "204", description = "Nenhum endereço encontrado para o CEP fornecido")
        ]
    )
    @GetMapping("/buscar-por-cep/{cep}")
    fun listarEnderecosPorCEP(@PathVariable cep: String): ResponseEntity<Any> {
        val lista = enderecoService.listarEnderecosPorCEP(cep)
        return if (lista.isNotEmpty()) {
            ResponseEntity.status(200).body(lista)
        } else {
            ResponseEntity.status(204).body("Nenhum endereço encontrado para o CEP fornecido")
        }
    }

    @Operation(summary = "Lista endereços por bairro")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Endereços encontrados"),
            ApiResponse(responseCode = "204", description = "Nenhum endereço encontrado para o bairro fornecido")
        ]
    )
    @GetMapping("/buscar-por-bairro/{bairro}")
    fun listarEnderecosPorBairro(@PathVariable bairro: String): ResponseEntity<Any> {
        val lista = enderecoService.listarEnderecosPorBairro(bairro)
        return if (lista.isNotEmpty()) {
            ResponseEntity.status(200).body(lista)
        } else {
            ResponseEntity.status(204).body("Nenhum endereço encontrado para o bairro fornecido")
        }
    }

//    @Operation(summary = "Lista endereços por usuário")
//    @ApiResponses(
//        value = [
//            ApiResponse(responseCode = "200", description = "Endereços encontrados"),
//            ApiResponse(responseCode = "204", description = "Nenhum endereço encontrado para o usuário fornecido")
//        ]
//    )
//    @GetMapping("/buscar-por-usuario/{usuario}")
//    fun listarEnderecosPorUsuario(@PathVariable usuario: String): ResponseEntity<Any> {
//        val lista = enderecoService.listarEnderecosPorUsuario(usuario)
//        return if (lista.isNotEmpty()) {
//            ResponseEntity.status(200).body(lista)
//        } else {
//            ResponseEntity.status(204).build()
//        }
//    }

    @Operation(summary = "Exclui um endereço pelo ID")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Endereço deletado com sucesso"),
            ApiResponse(responseCode = "404", description = "Endereço não encontrado para o ID fornecido")
        ]
    )
    @DeleteMapping("/excluir/{id}")
    fun excluirEnderecoExistente(@PathVariable id: Int): ResponseEntity<String> {
        return if (enderecoService.excluirEndereco(id)) {
            ResponseEntity.status(200).body("Endereço deletado com sucesso")
        } else {
            ResponseEntity.status(404).body("Endereço não encontrado para o ID fornecido")
        }
    }
}
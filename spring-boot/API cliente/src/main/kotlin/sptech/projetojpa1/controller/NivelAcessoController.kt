package sptech.projetojpa1.controller

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import sptech.projetojpa1.dto.nivelacesso.NivelAcessoCreateDTO
import sptech.projetojpa1.dto.nivelacesso.NivelAcessoResponseDTO
import sptech.projetojpa1.dto.nivelacesso.NivelAcessoUpdateDTO
import sptech.projetojpa1.service.NivelAcessoService

@RestController
@RequestMapping("/api/niveis-acesso")
class NivelAcessoController(
    private val service: NivelAcessoService
) {

    @Operation(summary = "Cadastra um novo nível de acesso")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "201", description = "Nível de acesso cadastrado com sucesso"),
            ApiResponse(responseCode = "400", description = "Dados de entrada inválidos")
        ]
    )
    @PostMapping("/cadastrar")
    fun cadastrarNivelAcesso(@RequestBody @Valid dto: NivelAcessoCreateDTO): ResponseEntity<NivelAcessoResponseDTO> {
        val responseDTO = service.cadastrarNivelAcesso(dto)
        return ResponseEntity.status(201).body(responseDTO)
    }

    @Operation(summary = "Lista todos os níveis de acesso")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Níveis de acesso listados com sucesso"),
            ApiResponse(responseCode = "204", description = "Nenhum nível de acesso encontrado")
        ]
    )
    @GetMapping("/listar")
    fun listarNiveisAcesso(): ResponseEntity<List<NivelAcessoResponseDTO>> {
        val lista = service.listarNiveisAcesso()
        return if (lista.isNotEmpty()) {
            ResponseEntity.status(200).body(lista)
        } else {
            ResponseEntity.status(204).build()
        }
    }

    @Operation(summary = "Atualiza o nome de um nível de acesso pelo ID")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Nome do nível de acesso atualizado com sucesso"),
            ApiResponse(responseCode = "404", description = "Nível de acesso não encontrado")
        ]
    )
    @PatchMapping("/atualizar-nome/{id}")
    fun atualizarNomeNivelAcesso(
        @PathVariable id: Int,
        @RequestBody @Valid dto: NivelAcessoUpdateDTO
    ): ResponseEntity<String> {
        return service.atualizarNomeNivelAcesso(id, dto)
    }

    @Operation(summary = "Exclui um nível de acesso pelo ID")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Nível de acesso excluído com sucesso"),
            ApiResponse(responseCode = "404", description = "Nível de acesso não encontrado")
        ]
    )
    @DeleteMapping("/excluir/{id}")
    fun excluirNivelAcesso(@PathVariable id: Int): ResponseEntity<String> {
        return service.excluirNivelAcesso(id)
    }
}
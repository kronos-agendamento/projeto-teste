package sptech.projetojpa1.controller

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import sptech.projetojpa1.dto.mensagem.MensagemRequestDTO
import sptech.projetojpa1.service.MensagemService


@RestController
@RequestMapping("/mensagem")
class MensagemController( private val
    service : MensagemService) {
    @Operation(summary = "Cadastrar nova mensagem")
    @ApiResponses(value=[ApiResponse(responseCode = "201", description = "Recurso criado com sucesso. Retornar mensagem cadastrada"),
    ApiResponse(responseCode = "400", description = "Requisição inválida. Retorna uma mensagem de erro"),ApiResponse(responseCode = "500", description = "Erro interno do servidor. Retorna uma mensagem de erro")
    ])
    @PostMapping("/cadastro-mensagem")
    fun cadastrarMensagem(@Valid @RequestBody novamensagem:MensagemRequestDTO): ResponseEntity<String>{
        val mensagemSalva = service.createMensagem(novamensagem)
        return ResponseEntity.status(201).body("Mensagem ${mensagemSalva.descricao} cadastrada com sucesso")
    }
}
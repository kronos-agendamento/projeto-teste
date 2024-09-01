package sptech.projetojpa1.controller

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import sptech.projetojpa1.domain.Especificacao
import sptech.projetojpa1.dto.especificacao.EspecificacaoDTO
import sptech.projetojpa1.service.EspecificacaoService

@RestController
@RequestMapping("/api/especificacoes")
class EspecificacaoController(
    private val service: EspecificacaoService
) {
    @Operation(
        summary = "Listar todas as especificações",
        description = "Retorna uma lista de todas as especificações disponíveis no sistema."
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Operação bem-sucedida. Retorna uma lista de especificações"
            ),
            ApiResponse(
                responseCode = "204",
                description = "Requisição bem-sucedida, mas não há conteúdo para ser exibido. Retorna uma resposta vazia"
            ),
            ApiResponse(responseCode = "500", description = "Erro interno do servidor. Retorna uma mensagem de erro")
        ]
    )
    @GetMapping
    fun listarEspecificacao(): ResponseEntity<List<Especificacao>> {
        val especificacoes = service.listarEspecificacao()
        return if (especificacoes.isNotEmpty()) {
            ResponseEntity.ok(especificacoes)
        } else {
            ResponseEntity.noContent().build()
        }
    }

    @Operation(summary = "Listar especificação por ID", description = "Busca uma especificação específica pelo seu ID.")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Operação bem-sucedida. Retorna a especificação encontrada"
            ),
            ApiResponse(responseCode = "404", description = "Especificação não encontrada"),
            ApiResponse(responseCode = "500", description = "Erro interno do servidor. Retorna uma mensagem de erro")
        ]
    )
    @GetMapping("/{id}")
    fun listarEspecificacaoPorId(@PathVariable id: Int): ResponseEntity<Especificacao> {
        val especificacao = service.listarEspecificacaoPorId(id)
        return if (especificacao != null) {
            ResponseEntity.ok(especificacao)
        } else {
            ResponseEntity.status(404).build()
        }
    }

    @Operation(
        summary = "Cadastrar nova especificação",
        description = "Cria uma nova especificação com base nos dados fornecidos."
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "201",
                description = "Recurso criado com sucesso. Retorna a especificação cadastrada"
            ),
            ApiResponse(responseCode = "400", description = "Requisição inválida. Retorna uma mensagem de erro"),
            ApiResponse(responseCode = "500", description = "Erro interno do servidor. Retorna uma mensagem de erro")
        ]
    )
    @PostMapping
    fun criarEspecificacao(@Valid @RequestBody dto: EspecificacaoDTO): ResponseEntity<Especificacao> {
        val especificacaoSalva = service.criarEspecificacao(dto)
        return ResponseEntity.status(201).body(especificacaoSalva)
    }

    @Operation(summary = "Editar especificação", description = "Atualiza os dados de uma especificação existente.")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Operação bem-sucedida. Retorna a especificação atualizada"
            ),
            ApiResponse(responseCode = "404", description = "Especificação não encontrada"),
            ApiResponse(responseCode = "500", description = "Erro interno do servidor. Retorna uma mensagem de erro")
        ]
    )
    @PatchMapping("/{id}")
    fun atualizarEspecificacao(
        @PathVariable id: Int,
        @Valid @RequestBody dto: EspecificacaoDTO
    ): ResponseEntity<Especificacao> {
        val especificacaoAtualizada = service.atualizarEspecificacao(id, dto)
        return if (especificacaoAtualizada != null) {
            ResponseEntity.ok(especificacaoAtualizada)
        } else {
            ResponseEntity.status(404).build()
        }
    }

    @Operation(
        summary = "Deletar especificação por ID",
        description = "Remove uma especificação do sistema pelo seu ID."
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Operação bem-sucedida"),
            ApiResponse(responseCode = "404", description = "Especificação não encontrada"),
            ApiResponse(responseCode = "500", description = "Erro interno do servidor. Retorna uma mensagem de erro")
        ]
    )
    @DeleteMapping("/{id}")
    fun deletarEspecificacao(@PathVariable id: Int): ResponseEntity<Void> {
        val especificacaoEncontrada = service.listarEspecificacaoPorId(id)
        return if (especificacaoEncontrada != null) {
            service.deletarEspecificacao(id)
            ResponseEntity.status(200).build()
        } else {
            ResponseEntity.status(404).build()
        }
    }

    @Operation(
        summary = "Obter receita acumulada",
        description = "Retorna a receita acumulada de todas as especificações."
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Operação bem-sucedida. Retorna a lista de receitas acumuladas"
            ),
            ApiResponse(
                responseCode = "204",
                description = "Requisição bem-sucedida, mas não há conteúdo para ser exibido"
            ),
            ApiResponse(responseCode = "500", description = "Erro interno do servidor. Retorna uma mensagem de erro")
        ]
    )
    @GetMapping("/receita-acumulada")
    fun getReceitaAcumulada(): ResponseEntity<List<Double>> {
        val resultado = service.getReceitaAcumulada()
        return if (resultado.isNotEmpty()) {
            ResponseEntity.ok(resultado)
        } else {
            ResponseEntity.noContent().build()
        }
    }

    @Operation(
        summary = "Obter labels de receita acumulada",
        description = "Retorna as labels das receitas acumuladas."
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Operação bem-sucedida. Retorna a lista de labels"
            ),
            ApiResponse(
                responseCode = "204",
                description = "Requisição bem-sucedida, mas não há conteúdo para ser exibido"
            ),
            ApiResponse(responseCode = "500", description = "Erro interno do servidor. Retorna uma mensagem de erro")
        ]
    )
    @GetMapping("/receita-acumulada-labels")
    fun getReceitaAcumuladaLabels(): ResponseEntity<List<String>> {
        val labels = service.getReceitaAcumuladaLabels()
        return if (labels.isNotEmpty()) {
            ResponseEntity.ok(labels)
        } else {
            ResponseEntity.noContent().build()
        }
    }

    @Operation(
        summary = "Obter nomes das especificações",
        description = "Retorna a lista de nomes de todas as especificações."
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Operação bem-sucedida. Retorna a lista de nomes"
            ),
            ApiResponse(
                responseCode = "204",
                description = "Requisição bem-sucedida, mas não há conteúdo para ser exibido"
            ),
            ApiResponse(responseCode = "500", description = "Erro interno do servidor. Retorna uma mensagem de erro")
        ]
    )
    @GetMapping("/nomes")
    fun getEspecificacoes(): ResponseEntity<List<String>> {
        val especificacoes = service.getEspecificacoes()
        return ResponseEntity.ok(especificacoes)
    }
}

package sptech.projetojpa1.controller

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import sptech.projetojpa1.dominio.Especificacao
import sptech.projetojpa1.dto.especificacao.EspecificacaoDTO
import sptech.projetojpa1.dto.especificacao.EspecificacaoReceitaMensalDTO
import sptech.projetojpa1.service.EspecificacaoService

@RestController
@RequestMapping("/especificacoes")
class EspecificacaoController(
    private val service: EspecificacaoService
) {

    @Operation(summary = "Listar todas as especificações")
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
    fun listarTodos(): ResponseEntity<List<Especificacao>> {
        val especificacoes = service.listarTodos()
        return if (especificacoes.isNotEmpty()) {
            ResponseEntity.ok(especificacoes)
        } else {
            ResponseEntity.noContent().build()
        }
    }

    @Operation(summary = "Listar especificação por descrição")
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
    @GetMapping("/listar-por-especificacao/{especificacao}")
    fun listarPorEspecificacao(@RequestParam especificacao: String): ResponseEntity<Especificacao> {
        val especificacaoEncontrada = service.listarPorEspecificacao(especificacao)
        return if (especificacaoEncontrada != null) {
            ResponseEntity.ok(especificacaoEncontrada)
        } else {
            ResponseEntity.status(404).build()
        }
    }

    @Operation(summary = "Listar especificação por ID")
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
    @GetMapping("/listar-por-id/{id}")
    fun listarPorId(@PathVariable id: Int): ResponseEntity<Especificacao> {
        val especificacao = service.listarPorId(id)
        return if (especificacao != null) {
            ResponseEntity.ok(especificacao)
        } else {
            ResponseEntity.status(404).build()
        }
    }

    @Operation(summary = "Cadastrar nova especificação")
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
    @PostMapping("/cadastro-especificacao")
    fun cadastrar(@Valid @RequestBody dto: EspecificacaoDTO): ResponseEntity<Especificacao> {
        val especificacaoSalva = service.cadastrar(dto)
        return ResponseEntity.status(201).body(especificacaoSalva)
    }

    @Operation(summary = "Deletar especificação por ID")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Operação bem-sucedida"),
            ApiResponse(responseCode = "404", description = "Especificação não encontrada"),
            ApiResponse(responseCode = "500", description = "Erro interno do servidor. Retorna uma mensagem de erro")
        ]
    )
    @DeleteMapping("/exclusao-por-id/{id}")
    fun deletarPorId(@PathVariable id: Int): ResponseEntity<Void> {
        val especificacaoEncontrada = service.listarPorId(id)
        return if (especificacaoEncontrada != null) {
            service.deletarPorId(id)
            ResponseEntity.status(200).build()
        } else {
            ResponseEntity.status(404).build()
        }
    }

    @Operation(summary = "Editar especificação")
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
    @PatchMapping("/atualizacao-especificacao/{id}")
    fun editarPorId(
        @PathVariable id: Int,
        @Valid @RequestBody dto: EspecificacaoDTO
    ): ResponseEntity<Especificacao> {
        val especificacaoAtualizada = service.editarPorId(id, dto)
        return if (especificacaoAtualizada != null) {
            ResponseEntity.ok(especificacaoAtualizada)
        } else {
            ResponseEntity.status(404).build()
        }
    }


    @Operation(summary = "Atualizar foto da especificação do procedimento")
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
    @PatchMapping(
        value = ["/atualizacao-foto/{codigo}"],
        consumes = ["image/jpeg", "image/png", "image/gif", "image/jpg"]
    )
    fun atualizarFotoEspecificacao(
        @PathVariable codigo: Int,
        @RequestBody foto: ByteArray
    ): ResponseEntity<Especificacao> {
        val especificacao = service.atualizarFotoEspecificacao(codigo, foto)
        return if (especificacao != null) {
            ResponseEntity.status(200).body(especificacao)
        } else {
            ResponseEntity.status(404).body(null)
        }
    }


    @Operation(summary = "Buscar foto da especificação")
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

    @GetMapping(
        value = ["/busca-imagem-especificacao/{codigo}"],
        produces = ["image/jpeg", "image/png", "image/gif", "image/jpg"]
    )
    fun getFoto(@PathVariable codigo: Int): ResponseEntity<ByteArray> {
        val foto = service.getFoto(codigo)
        return if (foto != null) {
            ResponseEntity.ok(foto)
        } else {
            ResponseEntity.status(404).body(null)
        }
    }

    @GetMapping("/receita-acumulada")
    fun getReceitaAcumulada(): ResponseEntity<List<Double>> {
        val resultado = service.getReceitaAcumulada()
        return if (resultado.isNotEmpty()) {
            ResponseEntity.ok(resultado)
        } else {
            ResponseEntity.noContent().build()
        }
    }

    @GetMapping("/receita-acumulada-labels")
    fun getReceitaAcumuladaLabels(): ResponseEntity<List<String>> {
        val labels = service.getReceitaAcumuladaLabels()
        return if (labels.isNotEmpty()) {
            ResponseEntity.ok(labels)
        } else {
            ResponseEntity.noContent().build()
        }
    }

}

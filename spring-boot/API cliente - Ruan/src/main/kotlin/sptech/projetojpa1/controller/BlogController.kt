package sptech.projetojpa1.controller

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import sptech.projetojpa1.dominio.Comentario
import sptech.projetojpa1.dominio.Publicacao
import sptech.projetojpa1.dto.comentario.ComentarioRequest
import sptech.projetojpa1.dto.publicacao.PublicacaoRequest
import sptech.projetojpa1.service.BlogService

@RestController
@RequestMapping("/blog")
class BlogController(
    private val blogService: BlogService
) {

    @Operation(
        summary = "Criar uma nova publicação",
        description = "Cria uma nova publicação para um usuário especificado"
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "201", description = "Publicação criada com sucesso"),
            ApiResponse(responseCode = "400", description = "Requisição inválida"),
            ApiResponse(responseCode = "404", description = "Usuário não encontrado")
        ]
    )
    @PostMapping("/publicacoes/{idUsuario}")
    fun criarPublicacao(
        @PathVariable idUsuario: Int,
        @RequestBody request: PublicacaoRequest
    ): ResponseEntity<Publicacao> {
        val publicacao = blogService.criarPublicacao(request, idUsuario)
        return ResponseEntity.status(201).body(publicacao)
    }

    @Operation(summary = "Editar uma publicação", description = "Edita uma publicação existente")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Publicação editada com sucesso"),
            ApiResponse(responseCode = "400", description = "Requisição inválida"),
            ApiResponse(responseCode = "404", description = "Publicação não encontrada")
        ]
    )
    @PutMapping("/publicacoes/{idPublicacao}")
    fun editarPublicacao(
        @PathVariable idPublicacao: Int,
        @RequestBody request: PublicacaoRequest
    ): ResponseEntity<Publicacao> {
        val publicacao = blogService.editarPublicacao(idPublicacao, request)
        return ResponseEntity.ok(publicacao)
    }

    @Operation(summary = "Excluir uma publicação", description = "Exclui uma publicação existente")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "204", description = "Publicação excluída com sucesso"),
            ApiResponse(responseCode = "404", description = "Publicação não encontrada")
        ]
    )
    @DeleteMapping("/publicacoes/{idPublicacao}")
    fun excluirPublicacao(@PathVariable idPublicacao: Int): ResponseEntity<Void> {
        blogService.excluirPublicacao(idPublicacao)
        return ResponseEntity.noContent().build()
    }

    @Operation(summary = "Listar publicações", description = "Lista todas as publicações")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Lista de publicações recuperada com sucesso")
        ]
    )
    @GetMapping("/publicacoes")
    fun listarPublicacoes(): ResponseEntity<List<Publicacao>> {
        val publicacoes = blogService.listarPublicacoes()
        return ResponseEntity.ok(publicacoes)
    }

    @Operation(summary = "Adicionar um comentário", description = "Adiciona um comentário a uma publicação")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "201", description = "Comentário adicionado com sucesso"),
            ApiResponse(responseCode = "400", description = "Requisição inválida"),
            ApiResponse(responseCode = "404", description = "Usuário ou publicação não encontrada")
        ]
    )
    @PostMapping("/comentarios/{idUsuario}")
    fun adicionarComentario(
        @PathVariable idUsuario: Int,
        @RequestBody request: ComentarioRequest
    ): ResponseEntity<Comentario> {
        val comentario = blogService.adicionarComentario(request, idUsuario)
        return ResponseEntity.status(201).body(comentario)
    }

    @Operation(summary = "Editar um comentário", description = "Edita um comentário existente")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Comentário editado com sucesso"),
            ApiResponse(responseCode = "400", description = "Requisição inválida"),
            ApiResponse(responseCode = "404", description = "Comentário não encontrado")
        ]
    )
    @PutMapping("/comentarios/{idComentario}")
    fun editarComentario(
        @PathVariable idComentario: Int,
        @RequestBody request: ComentarioRequest
    ): ResponseEntity<Comentario> {
        val comentario = blogService.editarComentario(idComentario, request)
        return ResponseEntity.ok(comentario)
    }

    @Operation(summary = "Excluir um comentário", description = "Exclui um comentário existente")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "204", description = "Comentário excluído com sucesso"),
            ApiResponse(responseCode = "404", description = "Comentário não encontrado")
        ]
    )
    @DeleteMapping("/comentarios/{idComentario}")
    fun excluirComentario(@PathVariable idComentario: Int): ResponseEntity<Void> {
        blogService.excluirComentario(idComentario)
        return ResponseEntity.noContent().build()
    }

    @Operation(summary = "Listar comentários", description = "Lista todos os comentários de uma publicação")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Lista de comentários recuperada com sucesso"),
            ApiResponse(responseCode = "404", description = "Publicação não encontrada")
        ]
    )
    @GetMapping("/publicacoes/{idPublicacao}/comentarios")
    fun listarComentarios(@PathVariable idPublicacao: Int): ResponseEntity<List<Comentario>> {
        val comentarios = blogService.listarComentarios(idPublicacao)
        return ResponseEntity.ok(comentarios)
    }

    @Operation(summary = "Curtir uma publicação", description = "Adiciona uma curtida a uma publicação")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Publicação curtida com sucesso"),
            ApiResponse(responseCode = "404", description = "Publicação não encontrada")
        ]
    )
    @PostMapping("/publicacoes/{idPublicacao}/curtir")
    fun curtirPublicacao(@PathVariable idPublicacao: Int): ResponseEntity<Void> {
        blogService.curtirPublicacao(idPublicacao)
        return ResponseEntity.ok().build()
    }

    @Operation(summary = "Descurtir uma publicação", description = "Remove uma curtida de uma publicação")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Curtida removida com sucesso"),
            ApiResponse(responseCode = "404", description = "Publicação não encontrada")
        ]
    )
    @PostMapping("/publicacoes/{idPublicacao}/descurtir")
    fun descurtirPublicacao(@PathVariable idPublicacao: Int): ResponseEntity<Void> {
        blogService.descurtirPublicacao(idPublicacao)
        return ResponseEntity.ok().build()
    }

    @Operation(summary = "Curtir um comentário", description = "Adiciona uma curtida a um comentário")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Comentário curtido com sucesso"),
            ApiResponse(responseCode = "404", description = "Comentário não encontrado")
        ]
    )
    @PostMapping("/comentarios/{idComentario}/curtir")
    fun curtirComentario(@PathVariable idComentario: Int): ResponseEntity<Void> {
        blogService.curtirComentario(idComentario)
        return ResponseEntity.ok().build()
    }

    @Operation(summary = "Descurtir um comentário", description = "Remove uma curtida de um comentário")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Curtida removida com sucesso"),
            ApiResponse(responseCode = "404", description = "Comentário não encontrado")
        ]
    )
    @PostMapping("/comentarios/{idComentario}/descurtir")
    fun descurtirComentario(@PathVariable idComentario: Int): ResponseEntity<Void> {
        blogService.descurtirComentario(idComentario)
        return ResponseEntity.ok().build()
    }
}

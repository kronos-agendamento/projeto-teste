package sptech.projetojpa1.controller

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import jakarta.validation.Valid
import org.apache.coyote.Response
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import sptech.projetojpa1.dominio.Educacao
import sptech.projetojpa1.dto.educacao.EducacaoDTO
import sptech.projetojpa1.dto.educacao.EducacaoPutDTO
import sptech.projetojpa1.dto.educacao.EducacaoRequestDTO
import sptech.projetojpa1.dto.educacao.EducacaoResponseDTO
import sptech.projetojpa1.dto.procedimento.ProcedimentoDTO
import sptech.projetojpa1.dto.procedimento.ProcedimentoRequestDTO
import sptech.projetojpa1.dto.procedimento.ProcedimentoResponseDTO
import sptech.projetojpa1.service.EducacaoService

@RestController
@RequestMapping("/educacao")
class EducacaoController (private val service: EducacaoService
)  {

    @Operation(summary = "Criar uma nova educação")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "201", description = "Educação criada com sucesso"),
            ApiResponse(responseCode = "400", description = "Dados inválidos")
        ]
    )

    @PostMapping("/criar")
    fun criarEducacao(@RequestBody educacaoRequestDTO: EducacaoRequestDTO): ResponseEntity<EducacaoDTO> {
        val educacaoDTO = service.criarEducacao(educacaoRequestDTO)
        return ResponseEntity(educacaoDTO, HttpStatus.CREATED)
    }

        @Operation(summary = "Buscar todos os programas educativos")
        @ApiResponses(
            value = [
                ApiResponse(responseCode = "200", description = "Lista de Programas Educativos"),
                ApiResponse(responseCode = "204", description = "Nenhum Programa Educativo encontrado")
            ]
        )
        @GetMapping("/listar")
        fun listarTodosEducativos(): ResponseEntity<List<EducacaoResponseDTO>> {
            val educativos = service.listarTodosEducativos()
            return ResponseEntity(educativos, HttpStatus.OK)
        }

    @Operation(summary = "Listar Programas de Educação Ativos")
    @ApiResponses(value = [
        ApiResponse(responseCode = "200", description = "Operação bem-sucedida. Retorna os programas encontrados"),
        ApiResponse(responseCode = "204", description = "Programas não encontrados"),
        ApiResponse(responseCode = "500", description = "Erro interno do servidor. Retorna uma mensagem de erro")
    ])
    @GetMapping("/listar-ativos")
    fun listarEducativosAtivos(@RequestParam ativo:Boolean): ResponseEntity<List<Educacao>> {
        val educacao = service.listarEducativosAtivos(ativo)
        return ResponseEntity.ok(educacao)
    }

    @Operation(summary = "Buscar Programa de Educação por Id")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Operação bem sucedida"),
            ApiResponse(responseCode = "404", description = "Procedimento não encontrado")
        ]
    )
    @GetMapping("/buscar/{id}")
    fun buscarEducacaoPorId(@PathVariable idEducacao: Int): ResponseEntity<EducacaoResponseDTO> {
        val educacaoDTO = service.buscarEducacaoPorId(idEducacao)
        return if (educacaoDTO != null) {
            ResponseEntity(educacaoDTO, HttpStatus.OK)
        } else {
            ResponseEntity(HttpStatus.NOT_FOUND)
        }
    }

    @Operation(summary = "Atualizar Programa Educativo")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Programa Educativo atualizado com sucesso"),
            ApiResponse(responseCode = "404", description = "Programa Educativo não encontrado"),
            ApiResponse(responseCode = "400", description = "Dados inválidos")
        ]
    )
    @PutMapping("/atualizar/{id}")
    fun atualizarEducacao (
        @PathVariable id:Int,
        @RequestBody educacaoRequestDTO:EducacaoPutDTO): ResponseEntity<EducacaoResponseDTO> {
        val educacaoDTO = service.atualizarEducacao(id, educacaoRequestDTO)
        return if (educacaoDTO != null) {
            ResponseEntity(educacaoDTO, HttpStatus.OK)
        } else {
            ResponseEntity(HttpStatus.NOT_FOUND)
        }
    }

    @Operation(summary = "Desativar Educação")
    @ApiResponses(value = [
        ApiResponse(responseCode = "200", description = "Operação bem-sucedida."),
        ApiResponse(responseCode = "404", description = "Educação não encontrada"),
        ApiResponse(responseCode = "500", description = "Erro interno do servidor. Retorna uma mensagem de erro")
    ])
    @PatchMapping("/desativacao-educacao/{id}")
    fun desativarEducacao(@Valid @PathVariable id:Int):ResponseEntity<Any> {
        val educacaoAtualizada = service.alterarStatusEducacao(id, false)
        return if (educacaoAtualizada != null) {
            ResponseEntity.status(200).body(educacaoAtualizada)
        } else  {
            ResponseEntity.status(404).body("Educação não encontrada para ser desativada")
        }
    }

    @Operation(summary = "Ativar Educação")
    @ApiResponses(value = [
        ApiResponse(responseCode = "200", description = "Operação bem-sucedida. Retorna o educativo ativado"),
        ApiResponse(responseCode = "404", description = "Educativo não encontrada"),
        ApiResponse(responseCode = "500", description = "Erro interno do servidor. Retorna uma mensagem de erro")
    ])

    @PatchMapping("/ativar-educacao/{id}")
    fun ativarEducativo(@Valid @PathVariable id:Int): ResponseEntity<Any> {
        val educativoAtualizado = service.alterarStatusEducacao(id, true)
        return if(educativoAtualizado != null) {
            ResponseEntity.status(200).body(educativoAtualizado)
        }else {
            ResponseEntity.status(404).body("Programa Educativo não encontrado")
        }
    }

    @Operation(summary = "Exclui um Programa de Educação pelo ID")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Programa de Educação excluído com sucesso"),
            ApiResponse(responseCode = "404", description = " =Programa de Educação não encontrado")
        ]
    )
    @DeleteMapping("/excluir/{id}")
    fun excluirEducacao(@PathVariable id:Int):ResponseEntity<String> {
        service.excluirEducacao(id)
        return ResponseEntity.ok("Educação excluida com sucesso")
    }
}
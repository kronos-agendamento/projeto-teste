package sptech.projetojpa1.controller

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import sptech.projetojpa1.dto.educacao.EducacaoDTO
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

    @Operation(summary = "Buscar educação por Id")
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
        @RequestBody educacaoRequestDTO:EducacaoRequestDTO): ResponseEntity<EducacaoResponseDTO> {
        val educacaoDTO = service.atualizarEducacao(id, educacaoRequestDTO)
        return if (educacaoDTO != null) {
            ResponseEntity(educacaoDTO, HttpStatus.OK)
        } else {
            ResponseEntity(HttpStatus.NOT_FOUND)
        }
    }

}
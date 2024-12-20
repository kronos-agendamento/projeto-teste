package sptech.projetojpa1.controller

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import jakarta.validation.Valid
import org.springframework.format.annotation.DateTimeFormat
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import sptech.projetojpa1.dto.FichaCompletaResponseDTO
import sptech.projetojpa1.dto.ficha.FichaRequest
import sptech.projetojpa1.dto.ficha.PerguntasRespostasRequest
import sptech.projetojpa1.service.FichaAnamneseService
import java.time.LocalDate

@RestController
@RequestMapping("/api/ficha-anamnese")
class FichaAnamneseController(
    val fichaAnamneseService: FichaAnamneseService
) {

    @Operation(
        summary = "Cadastrar nova ficha de anamnese",
        description = "Cria uma nova ficha de anamnese com base nas informações fornecidas. Retorna a ficha criada com sucesso."
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "201", description = "Recurso criado com sucesso. Retorna a ficha cadastrada"),
            ApiResponse(
                responseCode = "400",
                description = "Requisição inválida. Retorna uma mensagem de erro indicando quais dados estão incorretos"
            ),
            ApiResponse(
                responseCode = "500",
                description = "Erro interno do servidor. Retorna uma mensagem de erro geral"
            )
        ]
    )
    @PostMapping
    fun cadastrarFichaAnamnese(@RequestBody @Valid novaFichaAnamneseDTO: FichaRequest): ResponseEntity<FichaCompletaResponseDTO> {
        val fichaAnamneseSalva = fichaAnamneseService.cadastrarFichaAnamnese(novaFichaAnamneseDTO)
        return ResponseEntity.status(201).body(fichaAnamneseSalva)
    }

    @Operation(
        summary = "Listar todas as fichas de anamnese",
        description = "Retorna uma lista de todas as fichas de anamnese cadastradas. Caso não haja fichas cadastradas, retorna uma resposta vazia com o status 204."
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Operação bem-sucedida. Retorna uma lista de fichas de anamnese"
            ),
            ApiResponse(
                responseCode = "204",
                description = "Requisição bem-sucedida, mas não há conteúdo para ser exibido. Retorna uma resposta vazia"
            ),
            ApiResponse(
                responseCode = "500",
                description = "Erro interno do servidor. Retorna uma mensagem de erro geral"
            )
        ]
    )
    @GetMapping
    fun listarFichasAnamnese(): ResponseEntity<List<FichaCompletaResponseDTO>> {
        val fichas = fichaAnamneseService.listarFichasAnamnese()
        return if (fichas.isEmpty()) {
            ResponseEntity.status(204).build()
        } else {
            ResponseEntity.status(200).body(fichas)
        }
    }

    @Operation(
        summary = "Buscar ficha de anamnese por ID",
        description = "Busca uma ficha de anamnese específica com base no ID fornecido."
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Ficha encontrada com sucesso"),
            ApiResponse(responseCode = "404", description = "Ficha não encontrada")
        ]
    )
    @GetMapping("/{id}")
    fun buscarFichaPorId(@PathVariable id: Long): FichaCompletaResponseDTO {
        return fichaAnamneseService.buscarFichaPorId(id)
    }

    @Operation(
        summary = "Atualizar ficha de anamnese",
        description = "Atualiza os dados de uma ficha de anamnese existente."
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Ficha atualizada com sucesso"),
            ApiResponse(responseCode = "404", description = "Ficha não encontrada com o ID fornecido"),
            ApiResponse(responseCode = "400", description = "Dados inválidos fornecidos para atualização da ficha")
        ]
    )
    @PatchMapping("/{idFicha}")
    fun atualizarPerguntasRespostas(
        @PathVariable idFicha: Long,
        @RequestBody atualizacoes: PerguntasRespostasRequest
    ): ResponseEntity<FichaCompletaResponseDTO> {
        // Chama o serviço para atualizar as respostas de várias perguntas
        val fichaAtualizada = fichaAnamneseService.atualizarPerguntasRespostas(idFicha, atualizacoes.perguntasRespostas)

        // Retorna a ficha atualizada com o status HTTP 200 (OK)
        return ResponseEntity.ok(fichaAtualizada)
    }



    @Operation(
        summary = "Buscar fichas de anamnese",
        description = "Busca as fichas de anamnese de acordo com os filtros: nome do usuário, CPF e data de preenchimento."
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Fichas retornadas com sucesso"),
            ApiResponse(responseCode = "400", description = "Parâmetros inválidos"),
            ApiResponse(responseCode = "404", description = "Nenhuma ficha encontrada")
        ]
    )
    @GetMapping("/filtro")
    fun filtrarFichas(
        @RequestParam(required = false) nomeUsuario: String?,
        @RequestParam(required = false) cpf: String?,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) dataPreenchimento: LocalDate?,
        @RequestParam(required = false) idUsuario: Int?
    ): ResponseEntity<List<FichaCompletaResponseDTO>> {
        val fichas = fichaAnamneseService.buscarFichasPorFiltros(nomeUsuario, cpf, dataPreenchimento, idUsuario)

        return if (fichas.isNotEmpty()) {
            ResponseEntity.ok(fichas)
        } else {
            ResponseEntity.notFound().build()
        }
    }
}
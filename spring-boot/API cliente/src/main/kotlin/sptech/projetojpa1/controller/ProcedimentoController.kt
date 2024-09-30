package sptech.projetojpa1.controller

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import sptech.projetojpa1.dto.procedimento.ProcedimentoDTO
import sptech.projetojpa1.dto.procedimento.ProcedimentoEstatisticaDTO
import sptech.projetojpa1.dto.procedimento.ProcedimentoRequestDTO
import sptech.projetojpa1.dto.procedimento.ProcedimentoResponseDTO
import sptech.projetojpa1.service.ProcedimentoService

@RestController
@RequestMapping("/api/procedimentos")
class ProcedimentoController(private val procedimentoService: ProcedimentoService) {

    @Operation(
        summary = "Criar um novo procedimento",
        description = "Cria um novo procedimento com base nas informações fornecidas."
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "201", description = "Procedimento criado com sucesso"),
            ApiResponse(responseCode = "400", description = "Dados inválidos fornecidos para criação do procedimento")
        ]
    )
    @PostMapping
    fun criarProcedimento(@RequestBody procedimentoRequestDTO: ProcedimentoRequestDTO): ResponseEntity<ProcedimentoDTO> {
        val procedimentoDTO = procedimentoService.criarProcedimento(procedimentoRequestDTO)
        return ResponseEntity(procedimentoDTO, HttpStatus.CREATED)
    }

    @Operation(
        summary = "Buscar procedimento por ID",
        description = "Busca um procedimento específico com base no ID fornecido."
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Procedimento encontrado com sucesso"),
            ApiResponse(responseCode = "404", description = "Procedimento não encontrado com o ID fornecido")
        ]
    )
    @GetMapping("/{id}")
    fun buscarProcedimentoPorId(@PathVariable id: Int): ResponseEntity<ProcedimentoResponseDTO> {
        val procedimentoDTO = procedimentoService.buscarProcedimentoPorId(id)
        return if (procedimentoDTO != null) {
            ResponseEntity(procedimentoDTO, HttpStatus.OK)
        } else {
            ResponseEntity(HttpStatus.NOT_FOUND)
        }
    }

    @Operation(
        summary = "Buscar todos os procedimentos",
        description = "Retorna uma lista de todos os procedimentos disponíveis."
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Lista de procedimentos retornada com sucesso"),
            ApiResponse(responseCode = "204", description = "Nenhum procedimento encontrado")
        ]
    )
    @GetMapping
    fun listarTodosProcedimentos(): ResponseEntity<List<ProcedimentoResponseDTO>> {
        val procedimentos = procedimentoService.listarTodosProcedimentos()
        return if (procedimentos.isNotEmpty()) {
            ResponseEntity(procedimentos, HttpStatus.OK)
        } else {
            ResponseEntity(HttpStatus.NO_CONTENT)
        }
    }

    @Operation(
        summary = "Buscar procedimentos bem avaliados",
        description = "Retorna uma lista de procedimentos que receberam boas avaliações."
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Lista de procedimentos bem avaliados retornada com sucesso"
            ),
            ApiResponse(responseCode = "204", description = "Nenhum procedimento bem avaliado encontrado")
        ]
    )
    @GetMapping("/listar-bem-avaliados")
    fun listarProcedimentosBemAvaliados(): ResponseEntity<List<String>> {
        val procedimentos = procedimentoService.listarProcedimentosBemAvaliados()
        return if (procedimentos.isNotEmpty()) {
            ResponseEntity(procedimentos, HttpStatus.OK)
        } else {
            ResponseEntity(HttpStatus.NO_CONTENT)
        }
    }

    @Operation(
        summary = "Atualizar procedimento",
        description = "Atualiza as informações de um procedimento existente com base no ID fornecido e nos dados atualizados."
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Procedimento atualizado com sucesso"),
            ApiResponse(responseCode = "404", description = "Procedimento não encontrado com o ID fornecido"),
            ApiResponse(
                responseCode = "400",
                description = "Dados inválidos fornecidos para atualização do procedimento"
            )
        ]
    )
    @PutMapping("/{id}")
    fun atualizarProcedimento(
        @PathVariable id: Int,
        @RequestBody procedimentoRequestDTO: ProcedimentoRequestDTO
    ): ResponseEntity<ProcedimentoResponseDTO> {
        val procedimentoDTO = procedimentoService.atualizarProcedimento(id, procedimentoRequestDTO)
        return if (procedimentoDTO != null) {
            ResponseEntity(procedimentoDTO, HttpStatus.OK)
        } else {
            ResponseEntity(HttpStatus.NOT_FOUND)
        }
    }

    @Operation(
        summary = "Deletar procedimento",
        description = "Deleta um procedimento existente com base no ID fornecido."
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "204", description = "Procedimento deletado com sucesso"),
            ApiResponse(responseCode = "404", description = "Procedimento não encontrado com o ID fornecido")
        ]
    )
    @DeleteMapping("/{id}")
    fun deletarProcedimento(@PathVariable id: Int): ResponseEntity<Any> {
        val deleted = procedimentoService.deletarProcedimento(id)
        return if (deleted) {
            ResponseEntity(HttpStatus.NO_CONTENT)
        } else {
            ResponseEntity(HttpStatus.NOT_FOUND)
        }
    }

    @Operation(
        summary = "Buscar procedimento mais agendado",
        description = "Retorna o procedimento que mais foi agendado."
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Procedimento mais agendado retornado com sucesso"),
            ApiResponse(responseCode = "204", description = "Nenhum procedimento encontrado")
        ]
    )
    @GetMapping("/mais-agendado")
    fun getProcedimentoMaisAgendado(): ResponseEntity<ProcedimentoEstatisticaDTO> {
        val procedimento = procedimentoService.getProcedimentoMaisAgendado()
        return if (procedimento != null) {
            ResponseEntity(procedimento, HttpStatus.OK)
        } else {
            ResponseEntity(HttpStatus.NO_CONTENT)
        }
    }

    @Operation(
        summary = "Buscar procedimento menos agendado",
        description = "Retorna o procedimento que menos foi agendado."
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Procedimento menos agendado retornado com sucesso"),
            ApiResponse(responseCode = "204", description = "Nenhum procedimento encontrado")
        ]
    )
    @GetMapping("/menos-agendado")
    fun getProcedimentoMenosAgendado(): ResponseEntity<ProcedimentoEstatisticaDTO> {
        val procedimento = procedimentoService.getProcedimentoMenosAgendado()
        return if (procedimento != null) {
            ResponseEntity(procedimento, HttpStatus.OK)
        } else {
            ResponseEntity(HttpStatus.NO_CONTENT)
        }
    }

    @Operation(
        summary = "Buscar procedimento com melhor nota",
        description = "Retorna o procedimento que recebeu a melhor nota de avaliação."
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Procedimento com a melhor nota retornado com sucesso"),
            ApiResponse(responseCode = "204", description = "Nenhum procedimento encontrado")
        ]
    )
    @GetMapping("/melhor-nota")
    fun getProcedimentoComMelhorNota(): ResponseEntity<ProcedimentoEstatisticaDTO> {
        val procedimento = procedimentoService.getProcedimentoComMelhorNota()
        return if (procedimento != null) {
            ResponseEntity(procedimento, HttpStatus.OK)
        } else {
            ResponseEntity(HttpStatus.NO_CONTENT)
        }
    }

    @Operation(
        summary = "Buscar quantidade de agendamentos por procedimento",
        description = "Retorna a quantidade de agendamentos para cada procedimento."
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Quantidade de agendamentos por procedimento retornada com sucesso"
            )
        ]
    )
    @GetMapping("/quantidade-agendamentos-procedimentos")
    fun getQuantidadeAgendamentos(): ResponseEntity<List<Int>> {
        val quantidadeAgendamentos = procedimentoService.getQuantidadeAgendamentosPorProcedimento()
        return ResponseEntity.ok(quantidadeAgendamentos)
    }

    @Operation(
        summary = "Retorna os 3 procedimentos mais agendados por usuário",
        description = "Retorna os 3 procedimentos mais agendados por usuário."
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "3 procedimentos mais agendados por usuário retornada com sucesso"
            )
        ]
    )

    @GetMapping("/top3/{idUsuario}")
    fun getTop3ProcedimentosByUsuario(@PathVariable idUsuario: Int): ResponseEntity<List<Any>> {
        val procedimentos = procedimentoService.getTop3ProcedimentosByUsuario(idUsuario)
        return ResponseEntity.ok(procedimentos)
    }
}

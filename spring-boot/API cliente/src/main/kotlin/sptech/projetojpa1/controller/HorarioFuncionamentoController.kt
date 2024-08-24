package sptech.projetojpa1.controller

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import sptech.projetojpa1.dominio.HorarioFuncionamento
import sptech.projetojpa1.dto.horario.HorarioFuncionamentoAttRequest
import sptech.projetojpa1.dto.horario.HorarioFuncionamentoRequest
import sptech.projetojpa1.service.HorarioFuncionamentoService

@RestController
@RequestMapping("/horario-funcionamento")
class HorarioFuncionamentoController(
    private val service: HorarioFuncionamentoService
) {

    @Operation(summary = "Cadastrar novo horário de funcionamento")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "201",
                description = "Recurso criado com sucesso. Retorna o horário de funcionamento cadastrado"
            ),
            ApiResponse(responseCode = "400", description = "Requisição inválida. Retorna uma mensagem de erro"),
            ApiResponse(responseCode = "500", description = "Erro interno do servidor. Retorna uma mensagem de erro")
        ]
    )
    @PostMapping("/cadastro")
    fun cadastrarHorarioFuncionamento(@RequestBody @Valid request: HorarioFuncionamentoRequest): ResponseEntity<HorarioFuncionamento> {
        val horarioSalvo = service.cadastrarHorarioFuncionamento(request)
        return ResponseEntity.status(201).body(horarioSalvo)
    }

    @Operation(summary = "Listar todos os horários de funcionamento.")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Operação bem-sucedida. Retorna uma lista de horários de funcionamento"
            ),
            ApiResponse(
                responseCode = "204",
                description = "Requisição bem-sucedida, mas não há conteúdo para ser exibido"
            ),
            ApiResponse(responseCode = "500", description = "Erro interno do servidor. Retorna uma mensagem de erro")
        ]
    )
    @GetMapping
    fun listarHorariosFuncionamento(): ResponseEntity<List<HorarioFuncionamentoRequest>> {
        val lista = service.listarHorariosFuncionamento()
        return if (lista.isNotEmpty()) {
            val dtoList = lista.map { horario ->
                HorarioFuncionamentoRequest(
                    id = horario.id,
                    diaInicio = horario.diaInicio,
                    diaFim = horario.diaFim,
                    horarioAbertura = horario.horarioAbertura,
                    horarioFechamento = horario.horarioFechamento
                )
            }
            ResponseEntity.ok(dtoList)
        } else {
            ResponseEntity.noContent().build()
        }
    }

    @Operation(summary = "Excluir horário de funcionamento por id")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "204", description = "Operação bem-sucedida. Recurso excluído"),
            ApiResponse(responseCode = "404", description = "Horário de funcionamento não encontrado"),
            ApiResponse(responseCode = "500", description = "Erro interno do servidor. Retorna uma mensagem de erro")
        ]
    )
    @DeleteMapping("/{id}")
    fun excluirHorarioFuncionamento(@PathVariable id: Int): ResponseEntity<Void> {
        return if (service.excluirHorarioFuncionamento(id)) {
            ResponseEntity.noContent().build()
        } else {
            ResponseEntity.status(404).build()
        }
    }

    @Operation(summary = "Atualizar horário de abertura por id")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Operação bem-sucedida. Retorna o horário de abertura atualizado"
            ),
            ApiResponse(responseCode = "404", description = "Horário de funcionamento não encontrado"),
            ApiResponse(responseCode = "500", description = "Erro interno do servidor. Retorna uma mensagem de erro")
        ]
    )
    @PatchMapping("/{id}/abertura")
    fun atualizarHorarioAbertura(
        @PathVariable id: Int,
        @RequestBody @Valid request: HorarioFuncionamentoAttRequest
    ): ResponseEntity<String> {
        return if (service.atualizarHorarioAbertura(id, request.horario)) {
            ResponseEntity.ok("Horário de abertura atualizado com sucesso")
        } else {
            ResponseEntity.status(404).body("Horário de funcionamento não encontrado para o ID fornecido")
        }
    }

    @Operation(summary = "Atualizar horário de fechamento por id")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Operação bem-sucedida. Retorna o horário de fechamento atualizado"
            ),
            ApiResponse(responseCode = "404", description = "Horário de funcionamento não encontrado"),
            ApiResponse(responseCode = "500", description = "Erro interno do servidor. Retorna uma mensagem de erro")
        ]
    )
    @PatchMapping("/{id}/fechamento")
    fun atualizarHorarioFechamento(
        @PathVariable id: Int,
        @RequestBody @Valid request: HorarioFuncionamentoAttRequest
    ): ResponseEntity<String> {
        return if (service.atualizarHorarioFechamento(id, request.horario)) {
            ResponseEntity.ok("Horário de fechamento atualizado com sucesso")
        } else {
            ResponseEntity.status(404).body("Horário de funcionamento não encontrado para o ID fornecido")
        }
    }

    @Operation(summary = "Atualizar todos os dados de um horário de funcionamento por id")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Operação bem-sucedida. Retorna o horário de funcionamento atualizado"
            ),
            ApiResponse(responseCode = "404", description = "Horário de funcionamento não encontrado"),
            ApiResponse(responseCode = "500", description = "Erro interno do servidor. Retorna uma mensagem de erro")
        ]
    )
    @PatchMapping("/{id}")
    fun atualizarHorarioFuncionamento(
        @PathVariable id: Int,
        @RequestBody @Valid request: HorarioFuncionamentoRequest
    ): ResponseEntity<String> {
        return if (service.atualizarHorarioFuncionamento(id, request)) {
            ResponseEntity.ok("Horário de funcionamento atualizado com sucesso")
        } else {
            ResponseEntity.status(404).body("Horário de funcionamento não encontrado para o ID fornecido")
        }
    }
}

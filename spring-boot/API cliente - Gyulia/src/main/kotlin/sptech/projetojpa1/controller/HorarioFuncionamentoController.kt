//package sptech.projetojpa1.controller
//
//import jakarta.validation.Valid
//import org.springframework.http.ResponseEntity
//import org.springframework.web.bind.annotation.*
//import sptech.projetojpa1.dominio.HorarioFuncionamento
//import sptech.projetojpa1.repository.HorarioFuncionamentoRepository
//
//@RestController
//@RequestMapping("/horario-funcionamento")
//class HorarioFuncionamentoController(
//    val repository: HorarioFuncionamentoRepository
//) {
//    // Cadastro de Novo Horário de Funcionamento
//    @PostMapping("/cadastro-horario-funcionamento")
//    fun cadastrarHorarioFuncionamento(@RequestBody @Valid novoHorario: HorarioFuncionamento): ResponseEntity<HorarioFuncionamento> {
//        // Salvando o novo horário de funcionamento no banco de dados
//        val horarioSalvo = repository.save(novoHorario)
//        return ResponseEntity.status(201).body(horarioSalvo)
//    }
//
//    // Listar Horários de Funcionamento
//    @GetMapping("/lista-horario")
//    fun listarHorariosFuncionamento(): ResponseEntity<List<HorarioFuncionamento>> {
//        val lista = repository.findAll()
//        return if (lista.isNotEmpty()) {
//            // Retornando a lista de horários de funcionamento se houver algum encontrado
//            ResponseEntity.status(200).body(lista)
//        } else {
//            // Retornando status 404 se não houver nenhum horário de funcionamento encontrado
//            ResponseEntity.status(404).build()
//        }
//    }
//
//    // Excluir Horário de Funcionamento por ID
//    @DeleteMapping("/exclusao-horario/{id}")
//    fun excluirHorarioFuncionamento(@PathVariable id: Int): ResponseEntity<Void> {
//        if (repository.existsById(id)) {
//            repository.deleteById(id)
//            return ResponseEntity.status(204).build()
//        }
//        return ResponseEntity.status(404).build()
//    }
//
//    // Atualizar Horário de Abertura por ID
//    @PatchMapping("/atualizar-abertura/{id}")
//    fun atualizarHorarioAbertura(
//        @PathVariable id: Int,
//        @RequestParam("horarioAbertura") novoHorarioAbertura: String
//    ): ResponseEntity<String> {
//        val horarioOptional = repository.findById(id)
//        return if (horarioOptional.isPresent) {
//            val horario = horarioOptional.get()
//            horario.horarioAbertura = novoHorarioAbertura
//            repository.save(horario)
//            ResponseEntity.status(200).body("Horário de abertura atualizado com sucesso")
//        } else {
//            ResponseEntity.status(400).body("Horário de funcionamento não encontrado para o ID fornecido")
//        }
//    }
//
//    // Atualizar Horário de Fechamento por ID
//    @PatchMapping("/atualizar-fechamento/{id}")
//    fun atualizarHorarioFechamento(
//        @PathVariable id: Int,
//        @RequestParam("horarioFechamento") novoHorarioFechamento: String
//    ): ResponseEntity<String> {
//        val horarioOptional = repository.findById(id)
//        return if (horarioOptional.isPresent) {
//            val horario = horarioOptional.get()
//            horario.horarioFechamento = novoHorarioFechamento
//            repository.save(horario)
//            ResponseEntity.status(200).body("Horário de fechamento atualizado com sucesso")
//        } else {
//            ResponseEntity.status(404).body("Horário de funcionamento não encontrado para o ID fornecido")
//        }
//    }
//}
package sptech.projetojpa1.controller

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import sptech.projetojpa1.dto.horario.HorarioFuncionamentoAttRequest
import sptech.projetojpa1.dto.horario.HorarioFuncionamentoRequest
import sptech.projetojpa1.service.HorarioFuncionamentoService

@RestController
@RequestMapping("/horario-funcionamento")
class HorarioFuncionamentoController(
    val service: HorarioFuncionamentoService
) {

    @Operation(summary = "Cadastrar novo horário de funcionamento")
    @ApiResponses(value = [
        ApiResponse(responseCode = "201", description = "Recurso criado com sucesso. Retorna o horário de funcionamento cadastrado"),
        ApiResponse(responseCode = "400", description = "Requisição inválida. Retorna uma mensagem de erro"),
        ApiResponse(responseCode = "500", description = "Erro interno do servidor. Retorna uma mensagem de erro")
    ])
    @PostMapping("/cadastro-horario-funcionamento")
    fun cadastrarHorarioFuncionamento(@RequestBody @Valid novoHorario: HorarioFuncionamentoRequest): ResponseEntity<Any> {
        val horarioSalvo = service.cadastrarHorarioFuncionamento(novoHorario)
        return ResponseEntity.status(201).body(horarioSalvo)
    }

    @Operation(summary = "Listar todos os horários de funcionamento.")
    @ApiResponses(value = [
        ApiResponse(responseCode = "200", description = "Operação bem-sucedida. Retorna uma lista de horários de funcionamento"),
        ApiResponse(responseCode = "204", description = "Requisição bem-sucedida, mas não há conteúdo para ser exibido. Retorna uma resposta vazia"),
        ApiResponse(responseCode = "500", description = "Erro interno do servidor. Retorna uma mensagem de erro")
    ])
    @GetMapping
    fun listarHorariosFuncionamento(): ResponseEntity<List<HorarioFuncionamentoRequest>> {
        val lista = service.listarHorariosFuncionamento()
        return if (lista.isNotEmpty()) {
            val dtoList = lista.map { horario ->
                HorarioFuncionamentoRequest(
                    id= horario.codigo,
                    diaSemana = horario.diaSemana,
                    horarioAbertura = horario.horarioAbertura,
                    horarioFechamento = horario.horarioFechamento
                )
            }
            ResponseEntity.ok(dtoList)
        } else {
            ResponseEntity.noContent().build()
        }
    }

    @Operation(summary = "Deletar horário de funcionamento por id")
    @ApiResponses(value = [
        ApiResponse(responseCode = "200", description = "Operação bem-sucedida"),
        ApiResponse(responseCode = "404", description = "Horário de funcionamento não encontrado"),
        ApiResponse(responseCode = "500", description = "Erro interno do servidor. Retorna uma mensagem de erro")
    ])
    @DeleteMapping("/exclusao-por-id/{id}")
    fun excluirHorarioFuncionamento(@PathVariable id: Int): ResponseEntity<Void> {
        return if (service.excluirHorarioFuncionamento(id)) {
            ResponseEntity.status(204).build()
        } else {
            ResponseEntity.status(404).build()
        }
    }

    @Operation(summary = "Editar horário de abertura")
    @ApiResponses(value = [
        ApiResponse(responseCode = "200", description = "Operação bem-sucedida. Retorna o horário de abertura atualizado"),
        ApiResponse(responseCode = "404", description = "Horário de funcionamento não encontrado"),
        ApiResponse(responseCode = "500", description = "Erro interno do servidor. Retorna uma mensagem de erro")
    ])
    @PatchMapping("/atualizacao-horario-abertura/{id}")
    fun atualizarHorarioAbertura(@PathVariable id: Int, @RequestBody @Valid atualizacaoHorario: HorarioFuncionamentoAttRequest): ResponseEntity<String> {
        return if (service.atualizarHorarioAbertura(id, atualizacaoHorario.horario)) {
            ResponseEntity.status(200).body("Horário de abertura atualizado com sucesso")
        } else {
            ResponseEntity.status(404).body("Horário de funcionamento não encontrado para o ID fornecido")
        }
    }


    @Operation(summary = "Editar horário de fechamento")
    @ApiResponses(value = [
        ApiResponse(responseCode = "200", description = "Operação bem-sucedida. Retorna o horário de fechamento atualizado"),
        ApiResponse(responseCode = "404", description = "Horário de funcionamento não encontrado"),
        ApiResponse(responseCode = "500", description = "Erro interno do servidor. Retorna uma mensagem de erro")
    ])
    @PatchMapping("/atualizacao-horario-fechamento/{id}")
    fun atualizarHorarioFechamento(@PathVariable id: Int, @RequestBody @Valid atualizacaoHorario: HorarioFuncionamentoAttRequest): ResponseEntity<String> {
        return if (service.atualizarHorarioFechamento(id, atualizacaoHorario.horario)) {
            ResponseEntity.status(200).body("Horário de fechamento atualizado com sucesso")
        } else {
            ResponseEntity.status(404).body("Horário de funcionamento não encontrado para o ID fornecido")
        }
    }

}

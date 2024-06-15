package sptech.projetojpa1.controller

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import sptech.projetojpa1.dto.empresa.EmpresaRequestDTO
import sptech.projetojpa1.dto.empresa.EmpresaResponseDTO
import sptech.projetojpa1.dto.empresa.EmpresaUpdateDTO
import sptech.projetojpa1.service.EmpresaService

@RestController
@RequestMapping("/api/empresas")
class EmpresaController(
    private val empresaService: EmpresaService
) {
    @Operation(summary = "Cadastra uma nova empresa")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "201", description = "Empresa cadastrada com sucesso"),
            ApiResponse(responseCode = "400", description = "Dados de entrada inválidos")
        ]
    )
    @PostMapping("/cadastrar")
    fun cadastrarNovaEmpresa(@RequestBody @Valid novaEmpresa: EmpresaRequestDTO): ResponseEntity<EmpresaResponseDTO> {
        val empresa = empresaService.cadastrarEmpresa(novaEmpresa)
        return ResponseEntity.status(201).body(empresa)
    }

    @Operation(summary = "Exclui uma empresa pelo CNPJ")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Empresa excluída com sucesso"),
            ApiResponse(responseCode = "404", description = "Empresa não encontrada")
        ]
    )
    @DeleteMapping("/excluir-por-cnpj/{cnpj}")
    fun excluirEmpresaPorCNPJ(@PathVariable cnpj: String): ResponseEntity<String> {
        val mensagem = empresaService.excluirEmpresaPorCNPJ(cnpj)
        return ResponseEntity.status(200).body(mensagem)
    }

    @Operation(summary = "Lista todas as empresas")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Empresas listadas com sucesso"),
            ApiResponse(responseCode = "204", description = "Nenhuma empresa cadastrada ainda")
        ]
    )
    @GetMapping("/listar")
    fun listarTodasEmpresas(): ResponseEntity<Any> {
        val lista = empresaService.listarEmpresas()
        return if (lista.isNotEmpty()) {
            ResponseEntity.status(200).body(lista)
        } else {
            ResponseEntity.status(204).body("Nenhuma empresa cadastrada ainda.")
        }
    }

    @Operation(summary = "Filtra empresas pelo nome")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Empresas filtradas pelo nome com sucesso"),
            ApiResponse(responseCode = "404", description = "Empresa não encontrada pelo nome fornecido")
        ]
    )
    @GetMapping("/filtrar-por-nome/{nome}")
    fun filtrarEmpresasPorNome(@PathVariable nome: String): ResponseEntity<Any> {
        val empresas = empresaService.filtrarPorNome(nome)
        return if (empresas.isEmpty()) {
            ResponseEntity.status(404).body("Empresa não encontrada pelo nome fornecido.")
        } else {
            ResponseEntity.status(200).body(empresas)
        }
    }

    @Operation(summary = "Filtra empresas pelo CNPJ")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Empresas filtradas pelo CNPJ com sucesso"),
            ApiResponse(responseCode = "404", description = "Empresa não encontrada pelo CNPJ fornecido")
        ]
    )
    @GetMapping("/filtrar-por-cnpj/{cnpj}")
    fun filtrarEmpresasPorCNPJ(@PathVariable cnpj: String): ResponseEntity<Any> {
        val empresas = empresaService.filtrarPorCnpj(cnpj)
        return if (empresas.isEmpty()) {
            ResponseEntity.status(404).body("Empresa não encontrada pelo CNPJ fornecido.")
        } else {
            ResponseEntity.status(200).body(empresas)
        }
    }

    @Operation(summary = "Edita o CNPJ da empresa pelo nome")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "CNPJ atualizado com sucesso"),
            ApiResponse(responseCode = "404", description = "Empresa não encontrada pelo nome fornecido")
        ]
    )
    @PatchMapping("/editar-cnpj-por-nome/{nome}")
    fun editarCNPJDaEmpresaPorNome(
        @PathVariable nome: String,
        @RequestParam novoCNPJ: String
    ): ResponseEntity<Any> {
        val dto = EmpresaUpdateDTO(
            CNPJ = novoCNPJ,
            nome = null,
            contato = null,
            enderecoId = null,
            horarioFuncionamentoId = null
        )
        val empresa = empresaService.atualizarEmpresa(nome, dto) ?: return ResponseEntity.status(404)
            .body("Empresa não encontrada pelo nome fornecido.")
        return ResponseEntity.status(200).body(empresa)
    }

    @Operation(summary = "Edita o nome da empresa pelo CNPJ")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Nome atualizado com sucesso"),
            ApiResponse(responseCode = "404", description = "Empresa não encontrada pelo CNPJ fornecido")
        ]
    )
    @PatchMapping("/editar-nome-por-cnpj/{cnpj}")
    fun editarNomeDaEmpresaPorCNPJ(
        @PathVariable cnpj: String,
        @RequestParam novoNome: String
    ): ResponseEntity<Any> {
        val dto = EmpresaUpdateDTO(
            nome = novoNome,
            contato = null,
            CNPJ = null,
            enderecoId = null,
            horarioFuncionamentoId = null
        )
        val empresa = empresaService.atualizarEmpresa(cnpj, dto) ?: return ResponseEntity.status(404)
            .body("Empresa não encontrada pelo CNPJ fornecido.")
        return ResponseEntity.status(200).body(empresa)
    }

    @Operation(summary = "Edita o horário de funcionamento da empresa pelo CNPJ")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Horário de funcionamento atualizado com sucesso"),
            ApiResponse(responseCode = "404", description = "Empresa não encontrada pelo CNPJ fornecido")
        ]
    )
    @PatchMapping("/editar-horario-funcionamento-por-cnpj/{cnpj}")
    fun editarHorarioFuncionamentoDaEmpresaPorCNPJ(
        @PathVariable cnpj: String,
        @RequestParam(required = false) diaSemana: String?,
        @RequestParam(required = false) abertura: String?,
        @RequestParam(required = false) fechamento: String?
    ): ResponseEntity<Any> {
        val dto =
            EmpresaUpdateDTO(nome = null, contato = null, CNPJ = null, enderecoId = null, horarioFuncionamentoId = null)
        // Atualizar DTO conforme necessidade
        val empresa = empresaService.editarHorarioFuncionamento(cnpj, dto) ?: return ResponseEntity.status(404)
            .body("Empresa não encontrada pelo CNPJ fornecido.")
        return ResponseEntity.status(200).body(empresa)
    }

    @Operation(summary = "Edita o endereço da empresa pelo CNPJ")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Endereço atualizado com sucesso"),
            ApiResponse(responseCode = "404", description = "Empresa não encontrada pelo CNPJ fornecido")
        ]
    )
    @PatchMapping("/editar-endereco-por-cnpj/{cnpj}")
    fun editarEnderecoDaEmpresaPorCNPJ(
        @PathVariable cnpj: String,
        @RequestParam(required = false) novoCEP: String?,
        @RequestParam(required = false) novoLogradouro: String?,
        @RequestParam(required = false) novoNumero: Int?,
        @RequestParam(required = false) novoBairro: String?,
        @RequestParam(required = false) novaCidade: String?,
        @RequestParam(required = false) novoEstado: String?,
        @RequestParam(required = false) novoComplemento: String?
    ): ResponseEntity<Any> {
        val dto =
            EmpresaUpdateDTO(nome = null, contato = null, CNPJ = null, enderecoId = null, horarioFuncionamentoId = null)
        // Atualizar DTO conforme necessidade
        val empresa = empresaService.editarEndereco(cnpj, dto) ?: return ResponseEntity.status(404)
            .body("Empresa não encontrada pelo CNPJ fornecido.")
        return ResponseEntity.status(200).body(empresa)
    }
}
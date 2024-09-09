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

    @Operation(
        summary = "Listar todas as empresas",
        description = "Retorna uma lista de todas as empresas cadastradas.",
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Lista de empresas retornada com sucesso"),
            ApiResponse(responseCode = "204", description = "Nenhuma empresa encontrada")
        ]
    )
    @GetMapping
    fun listarEmpresas(): ResponseEntity<List<EmpresaResponseDTO>> {
        val empresas = empresaService.listarEmpresas()
        return if (empresas.isNotEmpty()) {
            ResponseEntity.ok(empresas)
        } else {
            ResponseEntity.noContent().build()
        }
    }

    @Operation(
        summary = "Buscar empresa por CNPJ",
        description = "Retorna os detalhes de uma empresa específica com base no CNPJ."
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Empresa encontrada"),
            ApiResponse(responseCode = "400", description = "CNPJ inválido"),
            ApiResponse(responseCode = "404", description = "Empresa não encontrada")
        ]
    )
    @GetMapping("/cnpj/{cnpj}")
    fun buscarEmpresasPorCNPJ(@PathVariable cnpj: String): ResponseEntity<EmpresaResponseDTO> {
        val empresa = empresaService.listarPorCnpj(cnpj)
        return ResponseEntity.ok(empresa)
    }

    @Operation(
        summary = "Buscar empresa por ID",
        description = "Retorna os detalhes de uma empresa específica com base no ID."
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Empresa encontrada"),
            ApiResponse(responseCode = "404", description = "Empresa não encontrada")
        ]
    )
    @GetMapping("/id/{id}")
    fun listarPorId(@PathVariable id: Int): ResponseEntity<EmpresaResponseDTO> {
        val empresa = empresaService.listarPorId(id)
        return ResponseEntity.ok(empresa)
    }

    @Operation(summary = "Criar uma nova empresa", description = "Cria uma nova empresa com base nos dados fornecidos.")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "201", description = "Empresa criada com sucesso"),
            ApiResponse(responseCode = "400", description = "Dados inválidos fornecidos para criar a empresa")
        ]
    )
    @PostMapping
    fun criarEmpresa(@RequestBody @Valid empresaDTO: EmpresaRequestDTO): ResponseEntity<EmpresaResponseDTO> {
        val novaEmpresa = empresaService.criarEmpresa(empresaDTO)
        return ResponseEntity.status(201).body(novaEmpresa)
    }

    @Operation(
        summary = "Atualizar uma empresa",
        description = "Atualiza os detalhes de uma empresa existente com base no CPF."
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Empresa atualizada com sucesso"),
            ApiResponse(responseCode = "400", description = "Dados inválidos fornecidos para atualizar a empresa"),
            ApiResponse(responseCode = "404", description = "Empresa não encontrada")
        ]
    )
    @PutMapping("/{cpf}")
    fun atualizarEmpresa(
        @PathVariable cpf: String,
        @RequestBody dto: EmpresaUpdateDTO
    ): ResponseEntity<EmpresaResponseDTO> {
        val empresaAtualizada = empresaService.atualizarEmpresa(cpf, dto)
        return empresaAtualizada?.let {
            ResponseEntity.ok(it)
        } ?: ResponseEntity.notFound().build()
    }

    @Operation(summary = "Deletar uma empresa", description = "Exclui uma empresa com base no CNPJ.")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Empresa excluída com sucesso"),
            ApiResponse(responseCode = "400", description = "CNPJ inválido"),
            ApiResponse(responseCode = "404", description = "Empresa não encontrada")
        ]
    )
    @DeleteMapping("/{cnpj}")
    fun deletarEmpresa(@PathVariable cnpj: String): ResponseEntity<String> {
        val mensagem = empresaService.deletarEmpresa(cnpj)
        return ResponseEntity.ok(mensagem)
    }
}
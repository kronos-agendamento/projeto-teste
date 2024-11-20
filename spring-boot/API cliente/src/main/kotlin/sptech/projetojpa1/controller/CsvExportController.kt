package sptech.projetojpa1.controller

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import org.springframework.http.ContentDisposition
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import sptech.projetojpa1.dto.csvexport.DadosExportRequest
import sptech.projetojpa1.service.CsvExportService

@RestController
@RequestMapping("/export")
class CsvExportController {

    private val csvExportService: CsvExportService

    // Injeção do Service
    constructor(csvExportService: CsvExportService) {
        this.csvExportService = csvExportService
    }

    @Operation(summary = "Exportar dados em CSV")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "CSV gerado com sucesso"),
            ApiResponse(responseCode = "400", description = "Requisição inválida. Retorna uma mensagem de erro"),
            ApiResponse(responseCode = "500", description = "Erro interno do servidor. Retorna uma mensagem de erro")
        ]
    )
    @PostMapping("/csv")
    fun exportarCsv(@RequestBody dadosRequest: DadosExportRequest): ResponseEntity<ByteArray> {
        val csvBytes = csvExportService.gerarCsv(dadosRequest)

        val headers = HttpHeaders().apply {
            contentType = MediaType.APPLICATION_OCTET_STREAM
            setContentDisposition(ContentDisposition.attachment().filename("export.csv").build())
        }

        return ResponseEntity.ok()
            .headers(headers)
            .body(csvBytes)
    }
}

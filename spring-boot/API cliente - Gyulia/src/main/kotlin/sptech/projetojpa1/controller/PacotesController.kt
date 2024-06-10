package sptech.projetojpa1.controller
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import sptech.projetojpa1.service.PacoteService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import sptech.projetojpa1.dto.pacote.PacoteDTO
import sptech.projetojpa1.dto.pacote.PacoteRequestDTO
import sptech.projetojpa1.dto.pacote.PacoteResponseDTO

@RestController
@RequestMapping("/api/pacotes")
class PacotesController(private val pacoteService: PacoteService) {


    @Operation(summary = "Cadastra um novo pacote")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "201", description = "Pacote criado com sucesso"),
            ApiResponse(responseCode = "400", description = "Dados de entrada inválidos")
        ]
    )
    @PostMapping
    fun criarPacote(@RequestBody pacoteRequestDTO: PacoteRequestDTO): ResponseEntity<PacoteDTO> {
        val novoPacote = pacoteService.criarPacote(pacoteRequestDTO)
        return ResponseEntity.status(201).body(novoPacote)
    }

    @Operation(summary = "Obtém a listagem dos pacotes cadastrados")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Lista de pacotes encontrada"),
            ApiResponse(responseCode = "204", description = "Nenhum pacote cadastrado")
        ]
    )
    @GetMapping
    fun listarPacotes(): ResponseEntity<List<PacoteResponseDTO>> {
        val pacotes = pacoteService.listarPacotes()
        return ResponseEntity.status(200).body(pacotes)
    }

    @Operation(summary = "Atualiza o pacote baseado no nome passado no parâmetro")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Pacote atualizado com sucesso"),
            ApiResponse(responseCode = "404", description = "Pacote não encontrado")
        ]
    )
    @PatchMapping("/itens")
    fun atualizarItensPorNomePacote(@RequestParam nomePacote: String, @RequestBody novosItens: List<PacoteRequestDTO.ItemDTO>): ResponseEntity<Any> {
        pacoteService.atualizarItensPorNomePacote(nomePacote, novosItens)
        return ResponseEntity.status(200).body("Pacote $nomePacote atualizado com sucesso")
    }

    @Operation(summary = "Atualiza os descontos do pacote baseado no nome passado no parâmetro")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Pacote atualizado com sucesso"),
            ApiResponse(responseCode = "404", description = "Pacote não encontrado")
        ]
    )
    @PatchMapping("/descontos")
    fun atualizarDescontosPorNomePacote(
        @RequestParam nomePacote: String,
        @RequestParam(required = false) descontoColocacao: Double?,
        @RequestParam(required = false) descontoManutencao: Double?
    ): ResponseEntity<Any> {
        pacoteService.atualizarDescontosPorNomePacote(nomePacote, descontoColocacao, descontoManutencao)
        return ResponseEntity.status(200).body("Pacote $nomePacote atualizado com sucesso")
    }

    @Operation(summary = "Atualiza o nome do pacote baseado no id passado no parâmetro")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Pacote atualizado com sucesso"),
            ApiResponse(responseCode = "404", description = "Pacote não encontrado")
        ]
    )
    @PatchMapping("/nome/{id}")
    fun atualizarNomePacote(@PathVariable id: Int, @RequestParam novoNome: String): ResponseEntity<Any> {
        pacoteService.atualizarNomePacote(id, novoNome)
        return ResponseEntity.status(200).body("Pacote $novoNome atualizado com sucesso")
    }

    @Operation(summary = "Exclui um pacote pelo ID")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Pacote excluído com sucesso"),
            ApiResponse(responseCode = "404", description = "Pacote não encontrado")
        ]
    )
    @DeleteMapping
    fun deletarPacotesPorId(@RequestParam id: Int): ResponseEntity<Any> {
        pacoteService.deletarPacotesPorId(id)
        return ResponseEntity.status(200).body("Pacote $id deletado com sucesso")
    }


    @Operation(summary = "Obtém pacotes entre um determinado valor de desconto de colocação.")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Pacotes encontrados"),
            ApiResponse(responseCode = "404", description = "Nenhum pacote encontrado para os parâmetros fornecidos")
        ]
    )
    @GetMapping("/desconto-colocacao")
    fun listarPacotesPorDescontoColocacaoEntre(@RequestParam min: Double, @RequestParam max: Double): ResponseEntity<List<PacoteDTO>> {
        val pacotes = pacoteService.listarPacotesPorDescontoColocacaoEntre(min, max)
        return ResponseEntity.ok(pacotes)
    }

    @Operation(summary = "Obtém pacotes entre um determinado valor de desconto de manutenção.")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Pacotes encontrados"),
            ApiResponse(responseCode = "404", description = "Nenhum pacote encontrado para os parâmetros fornecidos")
        ]
    )
    @GetMapping("/desconto-manutencao")
    fun listarPacotesPorDescontoManutencaoEntre(@RequestParam min: Double, @RequestParam max: Double): ResponseEntity<List<PacoteDTO>> {
        val pacotes = pacoteService.listarPacotesPorDescontoManutencaoEntre(min, max)
        return ResponseEntity.ok(pacotes)
    }

    @Operation(summary = "Obtém pacotes através do nome cadatrado.")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Pacotes encontrados"),
            ApiResponse(responseCode = "404", description = "Nenhum pacote encontrado para o parâmetro fornecidos")
        ]
    )
    @GetMapping("/nome")
    fun listarPacotesPorNome(@RequestParam nomePacote: String): ResponseEntity<List<PacoteDTO>> {
        val pacotes = pacoteService.listarPacotesPorNome(nomePacote)
        return ResponseEntity.ok(pacotes)
    }
}

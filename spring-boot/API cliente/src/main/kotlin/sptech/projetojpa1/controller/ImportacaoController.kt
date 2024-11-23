package sptech.projetojpa1.controller


import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.multipart.MultipartFile
import sptech.projetojpa1.service.ImportacaoService

@RestController
@RequestMapping("/api/importacao")
class ImportacaoController(
    private val importacaoService: ImportacaoService
) {

    @PostMapping("/importar")
    fun importarArquivo(@RequestParam("file") file: MultipartFile): ResponseEntity<String> {
        return try {
            if (file.isEmpty) throw IllegalArgumentException("O arquivo está vazio")
            val conteudoArquivo = String(file.bytes, Charsets.UTF_8)
            val resultado = importacaoService.importarArquivo(conteudoArquivo)
            ResponseEntity.ok(resultado)
        } catch (e: Exception) {
            ResponseEntity.badRequest().body("Erro ao processar o arquivo: ${e.message}")
        }
    }
}

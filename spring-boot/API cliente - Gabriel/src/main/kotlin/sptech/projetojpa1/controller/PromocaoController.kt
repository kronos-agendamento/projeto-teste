package sptech.projetojpa1.controller


import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import sptech.projetojpa1.dto.promocao.PromocaoRequestDTO
import sptech.projetojpa1.dto.promocao.PromocaoResponseDTO
import sptech.projetojpa1.service.PromocaoService

@RestController
@RequestMapping("/api/promocoes")
class PromocaoController(private val promocaoService: PromocaoService) {

    @GetMapping
    fun getAllPromocoes(): ResponseEntity<List<PromocaoResponseDTO>> =
        ResponseEntity.ok(promocaoService.getAllPromocoes())

    @GetMapping("/{id}")
    fun getPromocaoById(@PathVariable id: Int): ResponseEntity<PromocaoResponseDTO> =
        ResponseEntity.ok(promocaoService.getPromocaoById(id))

    @PostMapping
    fun createPromocao(@RequestBody requestDTO: PromocaoRequestDTO): ResponseEntity<PromocaoResponseDTO> =
        ResponseEntity.status(HttpStatus.CREATED).body(promocaoService.createPromocao(requestDTO))

    @PutMapping("/{id}")
    fun updatePromocao(@PathVariable id: Int, @RequestBody requestDTO: PromocaoRequestDTO): ResponseEntity<PromocaoResponseDTO> =
        ResponseEntity.ok(promocaoService.updatePromocao(id, requestDTO))

    @DeleteMapping("/{id}")
    fun deletePromocao(@PathVariable id: Int): ResponseEntity<Void> {
        promocaoService.deletePromocao(id)
        return ResponseEntity.noContent().build()
    }
}

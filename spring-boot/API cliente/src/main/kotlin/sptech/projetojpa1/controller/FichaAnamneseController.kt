package sptech.projetojpa1.controller

import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import sptech.projetojpa1.dominio.FichaAnamnese
import sptech.projetojpa1.repository.FichaAnamneseRepository

@RestController
@RequestMapping("/ficha")
class FichaAnamneseController(
    val fichaAnamneseRepository: FichaAnamneseRepository
) {
    // Endpoint para cadastrar uma nova ficha de anamnese
    @PostMapping("/cadastro-ficha-anamnese")
    fun cadastrarFichaAnamnese(@RequestBody @Valid novaFichaAnamnese: FichaAnamnese): ResponseEntity<FichaAnamnese> {
        // Salvando a nova ficha de anamnese no banco de dados
        val fichaAnamneseSalva = fichaAnamneseRepository.save(novaFichaAnamnese)
        return ResponseEntity.status(201).body(fichaAnamneseSalva)
    }

    // Endpoint para listar todas as fichas de anamnese
    @GetMapping("/lista-ficha")
    fun listarFichasAnamnese(): ResponseEntity<List<FichaAnamnese>> {
        // Buscando todas as fichas de anamnese no banco de dados
        val fichas = fichaAnamneseRepository.findAll()

        // Verificando se a lista de fichas está vazia
        if (fichas.isEmpty()) {
            // Retornando status 204 se não houver fichas de anamnese encontradas
            return ResponseEntity.status(204).build()
        }
        // Retornando a lista de fichas de anamnese se houver alguma encontrada
        return ResponseEntity.status(200).body(fichas)
    }
}

package sptech.projetojpa1.controller

import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import sptech.projetojpa1.dominio.Empresa
import sptech.projetojpa1.dominio.Endereco
import sptech.projetojpa1.repository.EmpresaRepository
import sptech.projetojpa1.repository.EnderecoRepository

@RestController
@RequestMapping("/endereco")
class EnderecoController (
    val repository: EnderecoRepository
) {
    // Cadastro de Novo Complemento
    @PostMapping
    fun post(@RequestBody @Valid novoEndereco: Endereco): ResponseEntity<Endereco> {
        repository.save(novoEndereco)
        return ResponseEntity.status(201).body(novoEndereco)
    }

    // Listar Endereco
    @GetMapping
    fun get(): ResponseEntity<List<Endereco>> {
        val lista = repository.findAll()

        if (lista.isNotEmpty()) {
            return ResponseEntity.status(200).body(lista)
        }
        return ResponseEntity.status(204).build()
    }

    // Listar por código
    @GetMapping("/{codigo}")
    fun get(@PathVariable codigo: Int): ResponseEntity<Endereco> {
        if (repository.existsById(codigo)) {
            val endereco = repository.findById(codigo).get()



            return ResponseEntity.status(200).body(endereco)
        }
        return ResponseEntity.status(404).build()
    }

    @GetMapping("/cep/{cep}")
    fun getByCEP(@PathVariable cep: String): ResponseEntity<List<Endereco>> {
        val lista = repository.findByCEPContaining(cep)
        return if (lista.isNotEmpty()) {
            ResponseEntity.status(200).body(lista)
        } else {
            ResponseEntity.status(204).build()
        }
    }

    @GetMapping("/bairro/{bairro}")
    fun getByBairro(@PathVariable bairro: String): ResponseEntity<List<Endereco>> {
        val lista = repository.findByBairroContaining(bairro)
        return if (lista.isNotEmpty()) {
            ResponseEntity.status(200).body(lista)
        } else {
            ResponseEntity.status(204).build()
        }
    }

    class ControllerEndereco(private val empresaRepository: EmpresaRepository) {

        @GetMapping("/empresa/{nomeEmpresa}")
        fun getEnderecoPorEmpresa(@PathVariable nomeEmpresa: String): ResponseEntity<String> {
            val empresas: List<Empresa> = empresaRepository.findByNomeContaining(nomeEmpresa)
            if (empresas.isNotEmpty()) {
                val enderecoCompleto = empresas.first().endereco.toString()
                return ResponseEntity.ok("Endereço completo da empresa $nomeEmpresa: $enderecoCompleto")
            }
            return ResponseEntity.notFound().build()
        }
    }

    @GetMapping("/usuario/{usuario}")
    fun getByUsuario(@PathVariable usuario: String): ResponseEntity<List<Endereco>> {
        val lista = repository.findByUsuarioNomeContaining(usuario)
        return if (lista.isNotEmpty()) {
            ResponseEntity.status(200).body(lista)
        } else {
            ResponseEntity.status(204).build()
        }
    }


}
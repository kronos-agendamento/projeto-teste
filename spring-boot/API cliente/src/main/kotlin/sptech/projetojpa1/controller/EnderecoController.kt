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
    @PostMapping ("/cadastro-endereco")
    fun post(@RequestBody @Valid novoEndereco: Endereco): ResponseEntity<Endereco> {
        repository.save(novoEndereco)
        return ResponseEntity.status(201).body(novoEndereco)
    }

    // Listar Endereco
    @GetMapping ("/lista-enderecos")
    fun get(): ResponseEntity<Any> {
        val lista = repository.findAll()

        if (lista.isNotEmpty()) {
            return ResponseEntity.status(200).body(lista)
        }
        return ResponseEntity.status(204).body("Nenhum item foi encontrado.")
    }

    // Listar por código
    @GetMapping("/lista-por-codigo/{codigo}")
    fun get(@PathVariable codigo: Int): ResponseEntity<Any> {
        if (repository.existsById(codigo)) {
            val endereco = repository.findById(codigo).get()

            return ResponseEntity.status(200).body(endereco)
        }
        return ResponseEntity.status(404).body("Endereço não encontrado para o ID fornecido")
    }

    @GetMapping("/lista-por-cep/{cep}")
    fun getByCEP(@PathVariable cep: String): ResponseEntity<Any> {
        val lista = repository.findByCepContaining(cep)
        return if (lista.isNotEmpty()) {
            ResponseEntity.status(200).body(lista)
        } else {
            ResponseEntity.status(204).body("Endereços não encontrado para o CEP fornecido")
        }
    }

    @GetMapping("/lista-por-bairro/{bairro}")
    fun getByBairro(@PathVariable bairro: String): ResponseEntity<Any> {
        val lista = repository.findByBairroContainsIgnoreCase(bairro)
        return if (lista.isNotEmpty()) {
            ResponseEntity.status(200).body(lista)
        } else {
            ResponseEntity.status(204).body("Endereços não encontrados para o bairro fornecido")
        }
    }

    class ControllerEndereco(private val empresaRepository: EmpresaRepository) {

        @GetMapping("/filtro-por-empresa/{nomeEmpresa}")
        fun getEnderecoPorEmpresa(@PathVariable nomeEmpresa: String): ResponseEntity<String> {
            val empresas: List<Empresa> = empresaRepository.findByNomeContainsIgnoreCase(nomeEmpresa)
            if (empresas.isNotEmpty()) {
                val enderecoCompleto = empresas.first().endereco.toString()
                return ResponseEntity.ok("Endereço completo da empresa $nomeEmpresa: $enderecoCompleto")
            }
            return ResponseEntity.notFound().build()
        }
    }

    @GetMapping("/filtro-por-usuario/{usuario}")
    fun getByUsuario(@PathVariable usuario: String): ResponseEntity<Any> {
        val lista = repository.findByUsuarioNomeContaining(usuario)
        return if (lista.isNotEmpty()) {
            ResponseEntity.status(200).body(lista)
        } else {
            ResponseEntity.status(204).build()
        }
    }

    @DeleteMapping("/exclusao/{id}")
    fun excluirEndereco(@PathVariable id: Int): ResponseEntity<String> {
        val enderecoOptional = repository.findById(id)
        return if (enderecoOptional.isPresent) {
            repository.deleteById(id)
            ResponseEntity.status(200).body("Endereço excluído com sucesso")
        } else {
            ResponseEntity.status(404).body("Endereço não encontrado para o ID fornecido")
        }
    }




}
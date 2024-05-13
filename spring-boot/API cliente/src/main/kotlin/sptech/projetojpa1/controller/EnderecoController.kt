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
class EnderecoController(
    val repository: EnderecoRepository,
) {

    // Cadastro de Novo Endereço
    @PostMapping("/cadastro-endereco")
    fun cadastrarEndereco(@RequestBody @Valid novoEndereco: Endereco): ResponseEntity<Endereco> {
        // Salvando o novo endereço no banco de dados
        val enderecoSalvo = repository.save(novoEndereco)
        return ResponseEntity.status(201).body(enderecoSalvo)
    }

    // Listar Endereços
    @GetMapping("/lista-enderecos")
    fun listarEnderecos(): ResponseEntity<Any> {
        // Buscando todos os endereços no banco de dados
        val lista = repository.findAll()

        return if (lista.isNotEmpty()) {
            // Retornando a lista de endereços se houver algum encontrado
            ResponseEntity.status(200).body(lista)
        } else {
            // Retornando status 204 se não houver nenhum endereço encontrado
            ResponseEntity.status(204).body("Nenhum endereço foi encontrado.")
        }
    }

    // Listar Endereço por Código
    @GetMapping("/lista-por-codigo/{codigo}")
    fun listarEnderecoPorCodigo(@PathVariable codigo: Int): ResponseEntity<Any> {
        return if (repository.existsById(codigo)) {
            // Buscando o endereço pelo código se existir no banco de dados
            val endereco = repository.findById(codigo).get()
            ResponseEntity.status(200).body(endereco)
        } else {
            // Retornando status 404 se o endereço não for encontrado
            ResponseEntity.status(404).body("Endereço não encontrado para o ID fornecido")
        }
    }

    // Listar Endereços por CEP
    @GetMapping("/lista-por-cep/{cep}")
    fun listarEnderecosPorCEP(@PathVariable cep: String): ResponseEntity<Any> {
        val lista = repository.findByCepContaining(cep)
        return if (lista.isNotEmpty()) {
            // Retornando a lista de endereços se houver algum encontrado para o CEP fornecido
            ResponseEntity.status(200).body(lista)
        } else {
            // Retornando status 204 se não houver endereços encontrados para o CEP fornecido
            ResponseEntity.status(204).body("Nenhum endereço encontrado para o CEP fornecido")
        }
    }

    // Listar Endereços por Bairro
    @GetMapping("/lista-por-bairro/{bairro}")
    fun listarEnderecosPorBairro(@PathVariable bairro: String): ResponseEntity<Any> {
        val lista = repository.findByBairroContainsIgnoreCase(bairro)
        return if (lista.isNotEmpty()) {
            // Retornando a lista de endereços se houver algum encontrado para o bairro fornecido
            ResponseEntity.status(200).body(lista)
        } else {
            // Retornando status 204 se não houver endereços encontrados para o bairro fornecido
            ResponseEntity.status(204).body("Nenhum endereço encontrado para o bairro fornecido")
        }
    }

    // Método aninhado para obter Endereço por Empresa
    class ControllerEndereco(private val empresaRepository: EmpresaRepository) {

        @GetMapping("/filtro-por-empresa/{nomeEmpresa}")
        fun obterEnderecoPorEmpresa(@PathVariable nomeEmpresa: String): ResponseEntity<String> {
            val empresas: List<Empresa> = empresaRepository.findByNomeContainsIgnoreCase(nomeEmpresa)
            return if (empresas.isNotEmpty()) {
                // Retornando o endereço completo da primeira empresa encontrada com o nome fornecido
                val enderecoCompleto = empresas.first().endereco.toString()
                ResponseEntity.ok("Endereço completo da empresa $nomeEmpresa: $enderecoCompleto")
            } else {
                // Retornando status 404 se nenhuma empresa for encontrada com o nome fornecido
                ResponseEntity.notFound().build()
            }
        }
    }

    // Listar Endereços por Usuário
    @GetMapping("/lista-por-usuario/{usuario}")
    fun listarEnderecosPorUsuario(@PathVariable usuario: String): ResponseEntity<Any> {
        val lista = repository.findByUsuarioNomeContaining(usuario)
        return if (lista.isNotEmpty()) {
            // Retornando a lista de endereços se houver algum encontrado para o usuário fornecido
            ResponseEntity.status(200).body(lista)
        } else {
            // Retornando status 204 se não houver endereços encontrados para o usuário fornecido
            ResponseEntity.status(204).build()
        }
    }

    // Excluir Endereço por ID
    @DeleteMapping("/exclusao-endereco/{id}")
    fun excluirEndereco(@Valid @PathVariable id: Int): ResponseEntity<String> {
        val enderecoOptional = repository.findById(id)
        return if (enderecoOptional.isPresent) {
            val enderecoDeletado = enderecoOptional.get()
            repository.deleteById(id)
            // Retornando mensagem de sucesso após excluir o endereço
            ResponseEntity.status(200).body("Endereço deletado com sucesso: $enderecoDeletado")
        } else {
            // Retornando status 404 se o endereço não for encontrado para o ID fornecido
            ResponseEntity.status(404).body("Endereço não encontrado para o ID fornecido")
        }
    }
}
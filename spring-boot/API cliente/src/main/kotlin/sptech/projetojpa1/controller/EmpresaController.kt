package sptech.projetojpa1.controller

import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import sptech.projetojpa1.dominio.Empresa
import sptech.projetojpa1.repository.EmpresaRepository
import java.time.LocalTime
import java.time.format.DateTimeFormatter
import java.time.format.DateTimeParseException

@RestController
@RequestMapping("/empresa")
class EmpresaController(
    val repository: EmpresaRepository
) {
    // Cadastro de Nova Empresa
    @PostMapping("/cadastro-empresa")
    fun cadastrarEmpresa(@RequestBody @Valid novaEmpresa: Empresa): ResponseEntity<Empresa> {
        repository.save(novaEmpresa)
        return ResponseEntity.status(201).body(novaEmpresa)
    }

    // Excluir Empresa por CNPJ
    @DeleteMapping("/exclusao-empresa/{cnpj}")
    fun excluirEmpresaPorCNPJ(@PathVariable cnpj: String): ResponseEntity<String> {
        repository.deleteByCNPJ(cnpj)
        return ResponseEntity.status(200).body("Empresa com CNPJ $cnpj excluída com sucesso")
    }

    // Listar empresas
    @GetMapping("/lista-empresas")
    fun listarEmpresas(): ResponseEntity<Any> {
        val lista = repository.findAll()
        return if (lista.isNotEmpty()) {
            ResponseEntity.status(200).body(lista)
        } else {
            ResponseEntity.status(204).body("Nenhuma empresa cadastrada ainda.")
        }
    }

    // Filtrar empresa por nome
    @GetMapping("/filtro-nome/{nome}")
    fun filtrarPorNome(@PathVariable nome: String): ResponseEntity<Any> {
        val empresas = repository.findByNomeContainsIgnoreCase(nome)
        return if (empresas.isEmpty()) {
            ResponseEntity.status(404).body("Empresa não encontrada pelo nome fornecido.")
        } else {
            ResponseEntity.status(200).body(empresas)
        }
    }

    // Filtrar empresa por CNPJ
    @GetMapping("/filtro-cnpj/{cnpj}")
    fun filtrarPorCnpj(@PathVariable cnpj: String): ResponseEntity<Any> {
        val empresas = repository.findByCNPJ(cnpj)
        return if (empresas.isEmpty()) {
            ResponseEntity.status(404).body("Empresa não encontrada pelo CNPJ fornecido.")
        } else {
            ResponseEntity.status(200).body(empresas)
        }
    }

    // Editar CNPJ da empresa
    @PatchMapping("/edicao-cnpj/{nome}")
    fun editarCNPJ(
        @PathVariable nome: String,
        @RequestParam novoCNPJ: String
    ): ResponseEntity<Any> {
        val empresa = repository.buscarPeloNomeIgnoreCase(nome)
        if (empresa == null) {
            return ResponseEntity.status(404).body("Empresa não encontrada pelo nome fornecido.")
        }
        empresa.CNPJ = novoCNPJ
        repository.save(empresa)
        return ResponseEntity.status(204).body(empresa)
    }

    // Editar nome da empresa
    @PatchMapping("/edicao-nome/{cnpj}")
    fun editarNome(
        @PathVariable cnpj: String,
        @RequestParam novoNome: String
    ): ResponseEntity<Any> {
        val empresa = repository.buscarPeloCNPJ(cnpj)
        if (empresa == null) {
            return ResponseEntity.status(404).body("Empresa não encontrada pelo CNPJ fornecido.")
        }
        empresa.nome = novoNome
        repository.save(empresa)
        return ResponseEntity.status(204).body(empresa)
    }

    // Editar horário de funcionamento da empresa
    @PatchMapping("/edicao-horario-funcionamento/{cnpj}")
    fun editarHorarioFuncionamento(
        @PathVariable cnpj: String,
        @RequestParam(required = false) diaSemana: String?,
        @RequestParam(required = false) abertura: String?,
        @RequestParam(required = false) fechamento: String?
    ): ResponseEntity<Any> {
        val empresa = repository.buscarPeloCNPJ(cnpj)
        if (empresa == null) {
            return ResponseEntity.status(404).body("Empresa não encontrada pelo CNPJ fornecido.")
        }

        val formato = DateTimeFormatter.ofPattern("HH:mm")

        try {
            diaSemana?.let { empresa.horarioFuncionamento?.diaSemana = it }
            abertura?.let { empresa.horarioFuncionamento?.horarioAbertura = LocalTime.parse(it, formato).toString() }
            fechamento?.let {
                empresa.horarioFuncionamento?.horarioFechamento = LocalTime.parse(it, formato).toString()
            }

            repository.save(empresa)

            return ResponseEntity.status(200).body(empresa)
        } catch (ex: DateTimeParseException) {
            return ResponseEntity.status(400).body("Formato de horário inválido. Use o formato HH:mm.")
        }
    }

    // Editar endereço da empresa
    @PatchMapping("/edicao-endereco/{cnpj}")
    fun editarEndereco(
        @PathVariable cnpj: String,
        @RequestParam(required = false) novoCEP: String?,
        @RequestParam(required = false) novoLogradouro: String?,
        @RequestParam(required = false) novoNumero: Int?,
        @RequestParam(required = false) novoBairro: String?,
        @RequestParam(required = false) novaCidade: String?,
        @RequestParam(required = false) novoEstado: String?,
        @RequestParam(required = false) novoComplemento: String?
    ): ResponseEntity<Any> {
        val empresa = repository.buscarPeloCNPJ(cnpj)
        if (empresa == null) {
            return ResponseEntity.status(404).body("Empresa não encontrada pelo CNPJ fornecido.")
        }

        novoCEP?.let { empresa.endereco.cep = it }
        novoLogradouro?.let { empresa.endereco.logradouro = it }
        novoNumero?.let { empresa.endereco.numero = it }
        novoBairro?.let { empresa.endereco.bairro = it }
        novaCidade?.let { empresa.endereco.cidade = it }
        novoEstado?.let { empresa.endereco.estado = it }
        novoComplemento?.let { empresa.endereco.complemento?.complemento = it }

        repository.save(empresa)
        return ResponseEntity.status(200).body(empresa)
    }
}

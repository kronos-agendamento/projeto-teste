package sptech.projetojpa1.controller

import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import sptech.projetojpa1.dominio.Empresa
import sptech.projetojpa1.dominio.HorarioFuncionamento
import sptech.projetojpa1.repository.EmpresaRepository
import java.time.LocalTime
import java.time.format.DateTimeFormatter
import java.time.format.DateTimeParseException

@RestController
@RequestMapping("/empresas")
class EmpresaController (
    val repository :EmpresaRepository
){
    // Cadastro de Nova Empresa
    @PostMapping
    fun post(@RequestBody @Valid novaEmpresa: Empresa): ResponseEntity<Empresa> {
        repository.save(novaEmpresa)
        return ResponseEntity.status(201).body(novaEmpresa)
    }

    // Listar empresas
    @GetMapping
    fun get():ResponseEntity<List<Empresa>>{
        val lista = repository.findAll()

        if (lista.isNotEmpty()){
            return ResponseEntity.status(200).body(lista)
        }
        return ResponseEntity.status(204).build()
    }

    @GetMapping("/filtro-nome/{nome}")
    fun filtroNome(@PathVariable nome:String):ResponseEntity<List<Empresa>>{
        val empresas = repository.findByNomeContainsIgnoreCase(nome)

        if (empresas.isEmpty()){
            return ResponseEntity.status(204).build()
        }
        return ResponseEntity.status(200).body(empresas)
    }

    @GetMapping("/filtro-cnpj/{cnpj}")
    fun filtroCnpj(@PathVariable cnpj:String):ResponseEntity<List<Empresa>>{
        val empresas = repository.findByCNPJ(cnpj)

        if (empresas.isEmpty()){
            return ResponseEntity.status(204).build()
        }
        return ResponseEntity.status(200).body(empresas)
    }


    @PatchMapping("/edicao-cnpj/{nome}")
    fun patchCNPJ(
        @PathVariable nome: String,
        @RequestParam novoCNPJ: String
    ): ResponseEntity<Empresa> {
        val empresa = repository.buscarPeloNome(nome)
        if(empresa == null){
            return ResponseEntity.status(404).build()
        }
        empresa.CNPJ = novoCNPJ
        repository.save(empresa)
        return ResponseEntity.status(204).build()
    }

    @PatchMapping("/edicao-nome/{cnpj}")
    fun patchNome(
        @PathVariable cnpj: String,
        @RequestParam novoNome: String
    ): ResponseEntity<Empresa> {
        val empresa = repository.buscarPeloCNPJ(cnpj)
        if(empresa == null){
            return ResponseEntity.status(404).build()
        }
        empresa.nome = novoNome
        repository.save(empresa)
        return ResponseEntity.status(204).build()
    }

    @PatchMapping("/edicao-horario-funcionamento/{cnpj}")
    fun patchHorario(
        @PathVariable cnpj: String,
        @RequestParam(required = false) diaSemana: String?,
        @RequestParam(required = false) abertura: String?, // Recebe a hora e o minuto juntos no formato "HH:mm"
        @RequestParam(required = false) fechamento: String? // Recebe a hora e o minuto juntos no formato "HH:mm"
    ): ResponseEntity<Any> {
        val empresa = repository.buscarPeloCNPJ(cnpj)
        if (empresa == null) {
            return ResponseEntity.status(404).build()
        }

        // Configura o formato esperado da string de horário
        val formato = DateTimeFormatter.ofPattern("HH:mm")

        try {
            // Verifique se cada parâmetro opcional não é nulo e, se não for, faça o parse para LocalTime
            diaSemana?.let { empresa.horarioFuncionamento?.diaSemana = it }
            abertura?.let { empresa.horarioFuncionamento?.horarioAbertura = LocalTime.parse(it, formato).toString() }
            fechamento?.let { empresa.horarioFuncionamento?.horarioFechamento = LocalTime.parse(it, formato).toString() }

            repository.save(empresa)

            return ResponseEntity.status(204).build()
        } catch (ex: DateTimeParseException) {
            // Trata erros de formato de data/horário
            return ResponseEntity.status(400).body("Formato de horário inválido. Use o formato HH:mm.")
        }
    }


    @PatchMapping("/edicao-endereco/{cnpj}")
    fun patchEndereco(
        @PathVariable cnpj: String,
        @RequestParam novoCEP: String?,
        @RequestParam novoLogradouro: String?,
        @RequestParam novoNumero: Int?,
        @RequestParam novoBairro: String?,
        @RequestParam novaCidade: String?,
        @RequestParam novoEstado: String?,
        @RequestParam novoComplemento: String?
    ): ResponseEntity<Empresa> {
        val empresa = repository.buscarPeloCNPJ(cnpj)
        if(empresa == null){
            return ResponseEntity.status(404).build()
        }

        // Verifique se cada parâmetro opcional não é nulo e, se não for, atualize o objeto empresa
        novoCEP?.let { empresa.endereco.cep = it }
        novoLogradouro?.let { empresa.endereco.logradouro = it }
        novoNumero?.let { empresa.endereco.numero = it }
        novoBairro?.let { empresa.endereco.bairro = it }
        novaCidade?.let { empresa.endereco.cidade = it }
        novoEstado?.let { empresa.endereco.estado = it }
        novoComplemento?.let { empresa.endereco.complemento?.complemento = it }


        repository.save(empresa)
        return ResponseEntity.status(204).build()
    }
}





package sptech.projetojpa1.controller

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import sptech.projetojpa1.dominio.Musica
import sptech.projetojpa1.repository.MusicaRepository
import java.time.LocalDate

@RestController
@RequestMapping("/musicas")
class MusicaController {

    /*
@Autowired -> Indica que é de responsabilidade do Spring em instanciar o objeto,
no caso, o 'repository'.
Assim, quando qualquer dos métodos da classe precisar do 'repository', ele já terá um valor válido
 */

    @Autowired
    lateinit var repository: MusicaRepository

    @PostMapping
    fun post(@RequestBody novaMusica: Musica): ResponseEntity<Musica> {
        // save() -> equivale a um "insert into tabela" ou a um "update tabela". Se o campo que for a Id será um insert, caso contrário, um update
        repository.save(novaMusica)
        return ResponseEntity.status(201).body(novaMusica)
    }

    @GetMapping
    fun get(): ResponseEntity<List<Musica>> {
        // findAll() -> equivale a um "select * from tabela"
        val lista = repository.findAll()

        if (lista.isNotEmpty()) {
            return ResponseEntity.status(200).body(lista)
        }
        return ResponseEntity.status(204).build()
    }

    @GetMapping("/{codigo}")
    fun get(@PathVariable codigo: Int): ResponseEntity<Musica> {
        // existsById() -> retorna true se o valor é uma PK que existe para a entidade
        /* if (repository.existsById(codigo)) {
            val musica = repository.findById(codigo).get()
            return ResponseEntity.status(200).body(musica)
        }
        return ResponseEntity.status(404).build()*/
        return ResponseEntity.of(repository.findById(codigo))
    }

    @DeleteMapping("/{codigo}")
    fun delete(@PathVariable codigo: Int):ResponseEntity<Void> {
        if(repository.existsById(codigo)){
            repository.deleteById(codigo)
            return  ResponseEntity.status(204).build()
        }
        return ResponseEntity.status(404).build()
    }

    @PutMapping("/{codigo}")
    fun put(
        @PathVariable codigo: Int, @RequestBody musica: Musica
    ): ResponseEntity<Musica> {
        if (repository.existsById(codigo)) {
            musica.codigo = codigo
            // save() -> equivale a um "insert into tabela" ou a um "update tabela". Se o campo que for a Id será um insert, caso contrário, um update
            repository.save(musica)
            return ResponseEntity.status(200).body(musica)
        }
        return ResponseEntity.status(400).build()
    }

    @GetMapping("/filtro-nome/{nome}")
    fun filtroNome(@PathVariable nome:String): ResponseEntity<List<Musica>> {
        val lista = repository.findByNomeContains(nome)

        if (lista.isNotEmpty()){
            return ResponseEntity.status(200).body(lista)
        }
        return ResponseEntity.status(204).build()

    }

    @GetMapping("/lancadas-apos/{lancamento}")
        fun filtroData(
            @PathVariable lancamento:LocalDate): ResponseEntity<List<Musica>> {

            val lista = repository.findByLancamentoAfter(lancamento)

        return if (lista.isEmpty())
            ResponseEntity.status(204).build()
            else ResponseEntity.status(200).body(lista)
        }

    @GetMapping("/ultima")
    fun ultima():ResponseEntity<Musica> {

        return ResponseEntity.of(
            repository.findTop1ByOrderByLancamentoDesc())
    }

    @GetMapping("/classicos")
    fun classicos():ResponseEntity<List<Musica>> {
        var lista = repository.findByClassicoTrue()

        if (lista.isNotEmpty()){
            return ResponseEntity.status(200).body(lista)
        }
        return ResponseEntity.status(204).build()
    }

    @GetMapping("/estiloeclassico/{estilo}/{classico}")
    fun estiloeclassico(@PathVariable estilo:String, @PathVariable classico:Boolean):ResponseEntity<List<Musica>>{
        var lista = repository.findByEstiloAndClassico(estilo, classico)

        if (lista.isNotEmpty()){
            return ResponseEntity.status(200).body(lista)
        }
        return ResponseEntity.status(204).build()
    }

    @GetMapping("/top3-tocadas")
    fun pegartop3():ResponseEntity<List<Musica>>{
        var lista = repository.findTop3ByOrderByTotalOuvintesDesc()

        if (lista.isNotEmpty()){
            return ResponseEntity.status(200).body(lista)
        }
        return ResponseEntity.status(204).build()
    }

    @GetMapping("/contagem-estilo/{estilo}")
    fun contarEstilo(@PathVariable estilo:String):ResponseEntity<Int>{
        var contagem = repository.countByEstilo(estilo)

        if (contagem.equals(0)){
            return ResponseEntity.status(204).build()
        }
        return ResponseEntity.status(200).body(contagem)
    }

}
package sptech.projetojpa1.controller

import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import sptech.projetojpa1.dominio.NivelAcesso
import sptech.projetojpa1.dominio.Usuario
import sptech.projetojpa1.repository.UsuarioRepository

@RestController
@RequestMapping("/usuarios")
class UsuarioController(
    var repository: UsuarioRepository
) {
    // Cadastro de Novo Usuario
    @PostMapping
    fun post(@RequestBody @Valid novoUsuario:Usuario):ResponseEntity<Usuario> {
        repository.save(novoUsuario)
        return ResponseEntity.status(201).body(novoUsuario)
    }

    // Listar Usuarios ativos
    @GetMapping
    fun get():ResponseEntity<List<Usuario>>{
        val lista = repository.findByStatusTrue()

        // se a lista não tiver vazia retorne o resultado com status 200
        if (lista.isNotEmpty()){
            return ResponseEntity.status(200).body(lista)
        }
        // caso ela esteja vazia, retorne o erro 204
        return ResponseEntity.status(204).build()
    }

    @GetMapping ("/todos")
    fun gettodos():ResponseEntity<List<Usuario>>{
        val lista = repository.findAll()

        // se a lista não tiver vazia retorne o resultado com status 200
        if (lista.isNotEmpty()){
            return ResponseEntity.status(200).body(lista)
        }
        // caso ela esteja vazia, retorne o erro 204
        return ResponseEntity.status(204).build()
    }

    // Listar por código
    @GetMapping("/{codigo}")
    fun get(@PathVariable codigo:Int):ResponseEntity<Usuario> {
        // se existir o codigo no repositorio retorna true e recolhe esse valor
        if (repository.existsById(codigo)){
            val cliente = repository.findById(codigo).get()

            // retorna o valor encontrado
            return ResponseEntity.status(200).body(cliente)
        }
        // se não encontrar o valor retorna erro sem corpo de resposta
        return ResponseEntity.status(404).build()
    }

    // Listar de acordo com o nível de acesso
    @GetMapping("/nivelAcesso/{nivel}")
    fun getclientes(
        @PathVariable nivelAcesso: NivelAcesso
    ):ResponseEntity<List<Usuario>>{
        val lista = repository.findByStatusTrueAndNivelAcesso(nivelAcesso)

        // se a lista não tiver vazia retorne o resultado com status 200
        if (lista.isNotEmpty()){
            return ResponseEntity.status(200).body(lista)
        }
        // caso ela esteja vazia, retorne o erro 204
        return ResponseEntity.status(204).build()
    }

    // Desativar o usuario
    @PatchMapping ("/desativar/{codigo}")
    fun desativar(@PathVariable codigo:Int):ResponseEntity<Void> {
        if (repository.existsById(codigo)){

            var cliente = repository.findById(codigo).get()
            cliente.status = false
            repository.save(cliente)

            return ResponseEntity.status(204).build()
        }
        return ResponseEntity.status(404).build()
    }

    //Ativar usuario
    @PatchMapping ("/ativar/{codigo}")
    fun ativar(@PathVariable codigo:Int):ResponseEntity<Void> {
        if (repository.existsById(codigo)){

            var cliente = repository.findById(codigo).get()
            cliente.status = true
            repository.save(cliente)

            return ResponseEntity.status(204).build()
        }
        return ResponseEntity.status(404).build()
    }

    // Atualizar Foto
    @PatchMapping(value = ["/imagem/{codigo}"], consumes = ["image/jpg", "image/png"])
    fun atualizarFoto(
        @PathVariable("codigo") codigo: Int,
        @RequestBody imagem:ByteArray
    ):ResponseEntity<Void>{

        var usuario = repository.findById(codigo).get()

        if (usuario == null){
            return ResponseEntity.status(404).build()
        }else{
            usuario.foto = imagem
            repository.save(usuario)

            return ResponseEntity.status(204).build()
        }

    }

    @GetMapping(value = ["/imagem/{codigo}"],produces = ["image/jpg", "image/png"])
    fun resgatarImagem(
        @PathVariable codigo:Int
    ):ResponseEntity<Void>{
        repository.findFotoByCodigo(codigo)
        return ResponseEntity.status(200).build()

    }
}
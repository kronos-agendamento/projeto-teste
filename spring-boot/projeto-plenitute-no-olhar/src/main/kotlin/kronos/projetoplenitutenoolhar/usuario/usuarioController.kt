package kronos.projetoplenitutenoolhar.usuario


import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/usuario")
class usuarioController {

    val listaUsuarios = mutableListOf<Usuario>(
        // Adicione mais usuários conforme necessário
    )

    fun existeUsuario(indice: Int): Boolean {
        return indice >= 0 && indice < listaUsuarios.size
    }

    @GetMapping // Utilizamos o Get para fazer listagens
    fun lista(): ResponseEntity<List<Usuario>> {

        if (listaUsuarios.isEmpty()) {
            return ResponseEntity.status(204).build()
        }
        return ResponseEntity.status(200).body(listaUsuarios)
    }

    @GetMapping("/{indice}") // Utilizamos o Get para fazer listagens
    fun Busca(@PathVariable indice: Int): ResponseEntity<Usuario> {
        if (existeUsuario(indice)) {
            return ResponseEntity.status(200).body(listaUsuarios[indice])
        }
        return ResponseEntity.status(404).build()
    }

    ////////////////////////////////////

    @PostMapping // Utilizamos o Post para cadastrar
    fun cadastrar(
        @RequestBody usuarios: Usuario
    ): Any {
        var remedioSLA = usuarios

        listaUsuarios.add(usuarios)
        return ResponseEntity.status(201).body("Usuario ${remedioSLA.nome} foi adicionado.")


    }

    @PatchMapping("/{indice}")
    fun atualizar(
        @PathVariable indice: Int,
        @RequestBody atualizacao: PatchUsuario
    ): ResponseEntity<Usuario> {
        try {
            val usuario = listaUsuarios[indice]
            usuario.senha = atualizacao.novoValorSenha
            usuario.email = atualizacao.novoValorEmail
            usuario.instagram = atualizacao.novoValorInstagram
            usuario.telefone = atualizacao.novoValorTelefone
            usuario.gestante = atualizacao.novoValorGestante
            return ResponseEntity.status(200).build()
        } catch (exception: Exception) {
            return ResponseEntity.status(404).build()
        }
    }

    @PutMapping("/{indice}")
    fun restaurar(
        @PathVariable indice: Int,
        @RequestBody atualizacao: PutSenha
    ): ResponseEntity<Usuario> {
        try {
            val usuario = listaUsuarios[indice]
            usuario.senha = atualizacao.novoValorSenha
            return ResponseEntity.status(200).build()
        } catch (exception: Exception) {
            return ResponseEntity.status(404).build()
        }
    }

    @DeleteMapping("/{indice}")
    fun deletar(@PathVariable indice: Int): String {
        var usuario1 = listaUsuarios[indice]
        if (existeUsuario(indice)) {
            listaUsuarios.removeAt(indice)
        }
        return "Usuário removido ${usuario1.nome}"
    }
}
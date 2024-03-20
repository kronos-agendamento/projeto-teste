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
    fun lista(): Any {

        if (listaUsuarios.isEmpty()) {
            return ResponseEntity.status(204).body("Nenhum usuário cadastrado.")
        }
        return ResponseEntity.status(200).body(listaUsuarios)
    }

    @GetMapping("/{indice}") // Utilizamos o Get para fazer listagens
    fun buscar(@PathVariable indice: Int): Any {
        if (existeUsuario(indice)) {
            return ResponseEntity.status(200).body(listaUsuarios[indice])
        }
        return ResponseEntity.status(404).body("Esse usuário não existe.")
    }

    ////////////////////////////////////

    @PostMapping // Utilizamos o Post para cadastrar
    fun cadastrar(
        @RequestBody usuarios: Usuario
    ): Any {
        var novoUsuario = usuarios

        listaUsuarios.add(usuarios)
        return ResponseEntity.status(201).body("Usuario ${novoUsuario.nome} foi adicionado.")

/*
    "senha": "Gyu06",
    "nome": "Gyulia Piqueira",
    "email": "gyulia@piqueira.com",
    "telefone": "11975536244",
    "instagram": "gyuliapiqueira",
    "rg": "05678178",
    "cpf": "468786455667",
    "data_nasc": "2004-05-06",
    "genero": 1,
    "indicacao": "Rita de Cássia"
 */
    }

    @PatchMapping("/{indice}")
    fun atualizar(
        @PathVariable indice: Int,
        @RequestBody atualizacao: PatchUsuario
    ): Any{
        try {
            val usuario = listaUsuarios[indice]
            usuario.senha = atualizacao.novoValorSenha
            usuario.email = atualizacao.novoValorEmail
            usuario.instagram = atualizacao.novoValorInstagram
            usuario.telefone = atualizacao.novoValorTelefone
            return ResponseEntity.status(200).body("Atualização realizada com sucesso.")
        } catch (exception: Exception) {
            return ResponseEntity.status(404).body("Esse usuário não existe.")
        }
/*
         "novoValorSenha": "GYU",
         "novoValorEmail": "gyulia@piq.com",
         "novoValorInstagram": "11975536277",
         "novoValorTelefone": "gyuliap"
 */
    }

    @PutMapping("/{indice}")
    fun restaurar(
        @PathVariable indice: Int,
        @RequestBody atualizacao: PutSenha
    ): Any {
        try {
            val usuario = listaUsuarios[indice]
            usuario.senha = atualizacao.novoValorSenha
            return ResponseEntity.status(200).body("Atualização realizada com sucesso.")
        } catch (exception: Exception) {
            return ResponseEntity.status(404).body("Esse usuário não existe.")
        }
/*
        "novoValorSenha": "GYUMPiq"
*/
    }

    @DeleteMapping("/{indice}")
    fun deletar(@PathVariable indice: Int): String {
        var usuario1 = listaUsuarios[indice]
        if (existeUsuario(indice)) {
            listaUsuarios.removeAt(indice)
            return "Usuário removido ${usuario1.nome}"
        }
        return "Esse usuário não existe."
    }
}
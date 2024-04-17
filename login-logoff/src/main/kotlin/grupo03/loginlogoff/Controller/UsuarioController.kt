package grupo03.loginlogoff.Controller

import grupo03.loginlogoff.Dominio.Usuario
import grupo03.loginlogoff.Service.UsuarioService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/usuarios")
class UsuarioController(private val usuarioService: UsuarioService) {

    @PostMapping("/criar")
    fun criarUsuario(@RequestBody usuario: Usuario): ResponseEntity<Any> {
        val novoUsuario = usuarioService.criarUsuario(usuario)
        return ResponseEntity.ok(novoUsuario)
    }

    @PostMapping("/login")
    fun login(@RequestBody usuario: Usuario): ResponseEntity<Any> {
        val usuarioAutenticado = usuarioService.autenticarUsuario(usuario.email, usuario.senha)
        return if (usuarioAutenticado != null) {
            ResponseEntity.ok(usuarioAutenticado)
        } else {
            ResponseEntity.badRequest().body("Email ou senha incorretos.")
        }
    }

    @PostMapping("/logoff/{id}")
    fun logoff(@PathVariable id: Long): ResponseEntity<Any> {
        usuarioService.deslogarUsuario(id)
        return ResponseEntity.ok("Usuário deslogado com sucesso.")
    }

    @GetMapping("/ativos")
    fun listarUsuariosAtivos(): ResponseEntity<List<Usuario>> {
        val usuariosAtivos = usuarioService.listarUsuariosAtivos()
        return ResponseEntity.ok(usuariosAtivos)
    }
}

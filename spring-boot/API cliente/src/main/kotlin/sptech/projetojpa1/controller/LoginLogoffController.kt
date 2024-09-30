package sptech.projetojpa1.controller
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import sptech.projetojpa1.domain.LoginLogoff
import sptech.projetojpa1.dto.loginlogoff.LoginLogoffRequest
import sptech.projetojpa1.service.LoginLogoffService
import sptech.projetojpa1.repository.LoginLogoffRepository
import sptech.projetojpa1.repository.UsuarioRepository

@RestController
@RequestMapping("/login-logoff")
class LoginLogoffController(
    private val loginLogoffRepository: LoginLogoffRepository,
    private val usuarioRepository: UsuarioRepository, // Assumindo que você tem o repositório de usuário para verificar fk_usuario
    private val loginLogoffService: LoginLogoffService
) {

    @PostMapping
    fun inserirLoginLogoff(@Valid @RequestBody loginLogoffRequest: LoginLogoffRequest): ResponseEntity<String> {
        // Busca o usuário correspondente ao fkUsuario
        val usuario = usuarioRepository.findById(loginLogoffRequest.fkUsuario)

        // Se o usuário não for encontrado, retorne um erro 404
        if (!usuario.isPresent) {
            return ResponseEntity("Usuário não encontrado", HttpStatus.NOT_FOUND)
        }

        // Cria a entidade LoginLogoff a partir da requisição
        val novoLoginLogoff = LoginLogoff(
            logi = loginLogoffRequest.logi,
            dataHorario = loginLogoffRequest.dataHorario,
            usuario = usuario.get() // Define a relação ManyToOne
        )

        // Salva no banco de dados
        loginLogoffRepository.save(novoLoginLogoff)

        return ResponseEntity("Log registrado com sucesso!", HttpStatus.CREATED)
    }
    @GetMapping("/retorno-usuarios-login")
    fun getUsuariosQueRetornaramAposUmMes(): ResponseEntity<Int> {
        val usuarios = loginLogoffService.getUsuariosQueRetornaramAposUmMes()
        return ResponseEntity.ok(usuarios)
    }
}
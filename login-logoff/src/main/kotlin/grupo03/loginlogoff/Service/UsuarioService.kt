// UsuarioService.kt
package grupo03.loginlogoff.Service

import grupo03.loginlogoff.Dominio.Usuario
import grupo03.loginlogoff.Repository.UsuarioRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class UsuarioService(private val usuarioRepository: UsuarioRepository) {

    fun criarUsuario(usuario: Usuario): Usuario {
        if (usuario.email.isBlank() || usuario.senha.isBlank()) {
            throw IllegalArgumentException("O email e a senha são obrigatórios.")
        }

        if (!usuario.email.matches(Regex("\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b"))) {
            throw IllegalArgumentException("O email fornecido não é válido.")
        }

        if (usuario.senha.length < 8 || !usuario.senha.matches(Regex("^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[@#$%^&+=]).{8,}$"))) {
            throw IllegalArgumentException("A senha deve ter no mínimo 8 caracteres, incluindo pelo menos um número e um caractere especial.")
        }

        val usuarioExistente = usuarioRepository.findByEmail(usuario.email)
        if (usuarioExistente != null) {
            throw IllegalArgumentException("Já existe um usuário cadastrado com este email.")
        }

        usuario.status = "inativo"
        return usuarioRepository.save(usuario)
    }

    fun autenticarUsuario(email: String, senha: String): Usuario? {
        val usuario = usuarioRepository.findByEmailAndSenha(email, senha)
        if (usuario != null) {
            usuario.status = "ativo"
            usuarioRepository.save(usuario)
        }
        return usuario
    }

    fun deslogarUsuario(id: Long) {
        val usuarioOptional = usuarioRepository.findById(id)
        if (usuarioOptional.isPresent) {
            val usuario = usuarioOptional.get()
            usuario.status = "inativo"
            usuarioRepository.save(usuario) // Atualizar o status para inativo
        }
    }

    fun listarUsuariosAtivos(): List<Usuario> {
        return usuarioRepository.findAll().filter { it.status == "ativo" }
    }
}

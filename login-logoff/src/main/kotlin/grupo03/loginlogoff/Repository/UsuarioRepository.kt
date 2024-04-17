package grupo03.loginlogoff.Repository

import grupo03.loginlogoff.Dominio.Usuario
import org.springframework.data.jpa.repository.JpaRepository

interface UsuarioRepository : JpaRepository<Usuario, Long> {
    fun findByEmail(email: String): Usuario?
    abstract fun findByEmailAndSenha(email: String, senha: String): Usuario?
}

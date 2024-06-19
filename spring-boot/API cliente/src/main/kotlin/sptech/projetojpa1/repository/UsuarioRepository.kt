package sptech.projetojpa1.repository

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import sptech.projetojpa1.dominio.NivelAcesso
import sptech.projetojpa1.dominio.Usuario

interface UsuarioRepository : JpaRepository<Usuario, Int> {

    // Encontra usuários pelo nome
    fun findByNome(nome: String): List<Usuario>

    // Encontra usuários pelo status
    fun findByStatus(status: Boolean): List<Usuario>

    // Encontra usuários pelo status e nível de acesso
    fun findByStatusTrueAndNivelAcesso(nivelAcesso: NivelAcesso): List<Usuario>

    // Encontra usuários com status verdadeiro
    fun findByStatusTrue(): List<Usuario>

    // Encontra usuário pelo CPF
    fun findByCpf(cpf: String): Usuario?

    // Encontra usuários cujos nomes contenham o texto fornecido (ignorando maiúsculas e minúsculas)
    fun findByNomeContainsIgnoreCase(nome: String): List<Usuario>

    // Encontra usuário pelo e-mail (ignorando maiúsculas e minúsculas)
    fun findByEmailIgnoreCase(email: String): Usuario?

    // Encontra a foto do usuário pelo código
    @Query("select u.foto from Usuario u where u.codigo = ?1")
    fun findFotoByCodigo(codigo: Int): ByteArray?

    fun findByNivelAcesso(nivelAcesso: NivelAcesso): List<Usuario>

    @Query(
        nativeQuery = true, value =
        "SELECT u.indicacao, COUNT(u.id_usuario) AS total_clientes " +
                "FROM Usuario u " +
                "WHERE u.data_nasc >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR) " +
                "GROUP BY u.indicacao " +
                "ORDER BY total_clientes DESC"
    )
    fun findClientesPorOrigem(): List<Usuario>

    @Query(
        nativeQuery = true, value =
        "SELECT COUNT(DISTINCT u.id_usuario) AS total_clientes " +
                "FROM usuario u " +
                "JOIN agendamento a ON u.id_usuario = a.fk_usuario " +
                "WHERE a.data BETWEEN DATE_SUB(NOW(), INTERVAL 3 MONTH) AND NOW()"
    )
    fun findClientesAtivos(): Double

    @Query(
        nativeQuery = true, value =
        """
        SELECT COUNT(u.id_usuario) AS qtd_clientes_inativos
        FROM usuario u
        WHERE u.id_usuario NOT IN (
            SELECT DISTINCT a.fk_usuario
            FROM agendamento a
            WHERE a.data BETWEEN DATE_SUB(NOW(), INTERVAL 3 MONTH) AND NOW()
        )
        """
    )
    fun findClientesInativos(): Double

    @Query(
        nativeQuery = true, value = """
        SELECT COUNT(u.id_usuario) AS qtd_clientes_fidelizados
        FROM usuario u
        JOIN (
            SELECT a.fk_usuario
            FROM agendamento a
            WHERE a.data BETWEEN DATE_SUB(NOW(), INTERVAL 3 MONTH) AND NOW()
            GROUP BY a.fk_usuario
            HAVING COUNT(DISTINCT MONTH(a.data)) = 3
        ) fidelizados ON u.id_usuario = fidelizados.fk_usuario
        """
    )
    fun findClientesFidelizadosUltimosTresMeses(): Double
}
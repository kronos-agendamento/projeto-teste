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

    @Query(nativeQuery = true, value =
        "SELECT u.indicacao, COUNT(u.id_usuario) AS total_clientes " +
                "FROM Usuario u " +
                "WHERE u.data_nasc >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR) " +
                "GROUP BY u.indicacao " +
                "ORDER BY total_clientes DESC"
    )
    fun findClientesPorOrigem(): List<Usuario>


    @Query(nativeQuery = true, value =
    """
    SELECT COUNT(DISTINCT u.id_usuario)
            FROM usuario u
            JOIN agendamento a ON u.id_usuario = a.fk_usuario
            WHERE a.data >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH)"""

    )
    fun findClientesAtivos(): List<Double>

    @Query(nativeQuery = true, value =
        "SELECT u FROM Usuario u " +
                "WHERE NOT EXISTS (SELECT 1 " +
                "FROM Agendamento a " +
                "WHERE u.id = a.usuario.id " +
                "AND a.data >= CURRENT_DATE - 3 MONTH)"
    )
    fun findClientesInativos(): List<Usuario>

    @Query(
        nativeQuery = true, value = """
        SELECT 
            u.id_usuario, 
            u.nome, 
            u.email, 
            COUNT(a.id_agendamento) AS num_agendamentos
        FROM 
            usuario u
        JOIN 
            agendamento a ON u.id_usuario = a.fk_usuario
        WHERE 
            a.data >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH)
        GROUP BY 
            u.id_usuario, u.nome, u.email
        HAVING 
            COUNT(a.id_agendamento) > 2
    """
    )
    fun findClientesFidelizadosUltimosTresMeses(): List<Usuario>
}

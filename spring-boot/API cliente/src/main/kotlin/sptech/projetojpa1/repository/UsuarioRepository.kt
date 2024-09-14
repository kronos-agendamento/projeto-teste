package sptech.projetojpa1.repository

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import sptech.projetojpa1.domain.NivelAcesso
import sptech.projetojpa1.domain.Usuario
import sptech.projetojpa1.domain.usuario.Cliente

interface UsuarioRepository : JpaRepository<Usuario, Int> {


    fun countByStatus(status: Boolean): Int

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
        nativeQuery = true, value = """
    SELECT 
        u.indicacao
    FROM 
        usuario u
    GROUP BY 
        u.indicacao
    ORDER BY 
        COUNT(u.indicacao) DESC
    LIMIT 3
    """
    )
    fun findTop3Indicacoes(): List<String>

    @Query(
        nativeQuery = true, value = """
    SELECT  
        COUNT(u.indicacao) AS frequencia
    FROM 
        usuario u
    GROUP BY 
        u.indicacao
    ORDER BY 
        frequencia DESC
    LIMIT 3
    """
    )
    fun buscarNumerosDivulgacao(): List<Int>

    @Query(
        nativeQuery = true, value =
        "SELECT COUNT(DISTINCT u.id_usuario) AS total_clientes " +
                "FROM usuario u " +
                "JOIN agendamento a ON u.id_usuario = a.fk_usuario " +
                "WHERE a.data_horario BETWEEN DATE_SUB(NOW(), INTERVAL 3 MONTH) AND NOW()"
    )
    fun findClientesAtivos(): Int

    @Query(
        nativeQuery = true, value =
        """
        SELECT COUNT(u.id_usuario) AS qtd_clientes_inativos
        FROM usuario u
        WHERE u.id_usuario NOT IN (
            SELECT DISTINCT a.fk_usuario
            FROM agendamento a
            WHERE a.data_horario BETWEEN DATE_SUB(NOW(), INTERVAL 3 MONTH) AND NOW()
            );
        """
    )
    fun findClientesInativos(): Int

    @Query(
        nativeQuery = true, value = """
    SELECT COUNT(u.id_usuario) AS qtd_clientes_fidelizados
    FROM usuario u
    JOIN (
        SELECT a.fk_usuario
        FROM agendamento a
        WHERE a.data_horario BETWEEN DATE_SUB(NOW(), INTERVAL 3 MONTH) AND NOW()
        GROUP BY a.fk_usuario
        HAVING COUNT(DISTINCT MONTH(a.data_horario)) = 3
    ) fidelizados ON u.id_usuario = fidelizados.fk_usuario;
    """
    )
    fun findClientesFidelizadosUltimosTresMeses(): Int

    @Query(
        nativeQuery = true, value = """
    SELECT 
    COUNT(DISTINCT a.fk_usuario) AS QTD_CLIENTES
FROM 
    agendamento a
JOIN 
    status sa ON a.fk_status = sa.id_status_agendamento
WHERE 
    sa.nome = 'Concluído' 
    AND a.data_horario BETWEEN DATE_SUB(CURDATE(), INTERVAL 5 MONTH) AND CURDATE()
GROUP BY 
    YEAR(a.data_horario), MONTH(a.data_horario), MONTHNAME(a.data_horario) -- Agrupar por ano, mês e nome do mês
HAVING 
    COUNT(a.id_agendamento) >= 2 -- Apenas meses com pelo menos 2 agendamentos concluídos
ORDER BY 
    YEAR(a.data_horario) DESC, MONTH(a.data_horario) DESC;

    """
    )
    fun findClientesFidelizados5Meses(): List<Int>

    @Query(
        nativeQuery = true,
        value = """
        WITH UserAgendamentos AS (
            SELECT a.fk_usuario, 
                   YEAR(a.data_horario) AS ano, 
                   MONTH(a.data_horario) AS mes
            FROM agendamento a
            JOIN status sa ON a.fk_status = sa.id_status_agendamento
            WHERE sa.nome = 'Concluído'
              AND a.data_horario BETWEEN DATE_SUB(CURDATE(), INTERVAL 5 MONTH) AND CURDATE()
            GROUP BY a.fk_usuario, YEAR(a.data_horario), MONTH(a.data_horario)
            HAVING COUNT(a.id_agendamento) = 1
        )
        SELECT  
            COUNT(DISTINCT fk_usuario) AS QTD_CLIENTES
        FROM UserAgendamentos
        GROUP BY ano, mes
        ORDER BY ano DESC, mes DESC;
        """
    )
    fun findClientesConcluidos5Meses(): List<Int>


    abstract fun save(cliente: Cliente): Cliente



}
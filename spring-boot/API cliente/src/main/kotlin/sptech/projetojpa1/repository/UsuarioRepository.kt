package sptech.projetojpa1.repository

import jakarta.transaction.Transactional
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import sptech.projetojpa1.domain.Endereco
import sptech.projetojpa1.domain.NivelAcesso
import sptech.projetojpa1.domain.Usuario
import sptech.projetojpa1.domain.usuario.Cliente
import sptech.projetojpa1.dto.usuario.UsuarioResponseDTO
import java.time.LocalDate

interface UsuarioRepository : JpaRepository<Usuario, Int> {

    @Query("SELECT u FROM Usuario u")
    fun findAllUsuarios(): List<Usuario>

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
    @Query("select u.foto from Usuario u where u.cpf = ?1")
    fun findFotoByCpf(cpf: String): ByteArray?

    @Query("select u.foto from Usuario u where lower(u.nome) like lower(concat('%', ?1, '%'))")
    fun findFotoByNomeContainsIgnoreCase(nome: String): ByteArray?


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
        nativeQuery = true,
        value = """
        SELECT COUNT(DISTINCT u.id_usuario) AS total_clientes
FROM usuario u
JOIN agendamento a ON u.id_usuario = a.fk_usuario
WHERE a.data_horario BETWEEN COALESCE(:startDate, DATE_SUB(NOW(), INTERVAL 3 MONTH))
                        AND COALESCE(:endDate, NOW());

    """
    )
    fun findClientesAtivos(
        @Param("startDate") startDate: String?,
        @Param("endDate") endDate: String?
    ): Int


    @Query(
        nativeQuery = true, value = """
        SELECT COUNT(u.id_usuario) AS qtd_clientes_inativos
        FROM usuario u
        WHERE u.id_usuario NOT IN (
            SELECT DISTINCT a.fk_usuario
            FROM agendamento a
            WHERE a.data_horario BETWEEN COALESCE(:startDate, DATE_SUB(NOW(), INTERVAL 3 MONTH)) 
                                    AND COALESCE(:endDate, NOW())
        );
    """
    )
    fun findClientesInativos(
        @Param("startDate") startDate: String?,
        @Param("endDate") endDate: String?
    ): Int


    @Query(
        nativeQuery = true, value = """
    SELECT COUNT(u.id_usuario) AS qtd_clientes_fidelizados
    FROM usuario u
    JOIN (
        SELECT a.fk_usuario
        FROM agendamento a
        WHERE a.data_horario BETWEEN COALESCE(:startDate, DATE_SUB(NOW(), INTERVAL 3 MONTH))
                                AND COALESCE(:endDate, NOW())
        GROUP BY a.fk_usuario
        HAVING COUNT(DISTINCT MONTH(a.data_horario)) = 3
    ) fidelizados ON u.id_usuario = fidelizados.fk_usuario;
    """
    )
    fun findClientesFidelizadosUltimosTresMeses(
        @Param("startDate") startDate: String?,
        @Param("endDate") endDate: String?
    ): Int


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

    @Query(
        nativeQuery = true, value = """
            SELECT u.id_usuario AS idUsuario, u.nome, u.data_nasc AS dataNasc, u.instagram, u.telefone, u.cpf, 
                   u.status, u.email, u.genero, u.indicacao, u.fk_endereco AS endereco
            FROM usuario u
            JOIN (
                SELECT a.fk_usuario
                FROM agendamento a
                WHERE a.data_horario BETWEEN DATE_SUB(NOW(), INTERVAL 3 MONTH) AND NOW()
                GROUP BY a.fk_usuario
                HAVING COUNT(DISTINCT DATE_FORMAT(a.data_horario, '%Y-%m')) = 3
            ) fidelizados ON u.id_usuario = fidelizados.fk_usuario;
        """
    )
    fun findClientesFidel(): List<Map<String, Any>>

    // Busca todos os usuários de uma cidade específica
    fun findAllByEndereco_Cidade(cidade: String): List<Usuario>

    // Conta o número de usuários em uma cidade específica
    fun countByEndereco_Cidade(cidade: String): Long

    abstract fun save(cliente: Cliente): Cliente

    @Query(
        nativeQuery = true, value =
        """       
     SELECT l.id_lead, l.nome, l.email, l.telefone, l.instagram, l.mensagem
                FROM leads l
                ORDER BY l.id_lead ASC;
                """
    )
    fun listarLeads(): List<Map<String, Any>>

    @Modifying
    @Transactional
    @Query("DELETE FROM Usuario u WHERE u.codigo = :id")
    fun deletarPorId(@Param("id") id: Int): Int

    fun findAllByEmpresaIdEmpresa(empresaId: Int): List<Usuario>
}
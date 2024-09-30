package sptech.projetojpa1.repository

import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository
import sptech.projetojpa1.domain.LoginLogoff

@Repository
interface LoginLogoffRepository : CrudRepository<LoginLogoff, Int> {

    @Query(value = """
        SELECT 
    ROUND(
        (COUNT(DISTINCT a.fk_usuario) / (SELECT COUNT(DISTINCT fk_usuario) FROM login_logoff)) * 100, 2
    ) AS porcentagem_retornos
FROM 
    login_logoff a
WHERE 
    EXISTS (
        SELECT 1 
        FROM login_logoff b
        WHERE b.fk_usuario = a.fk_usuario 
          AND b.data_horario > a.data_horario
          AND b.data_horario <= DATE_ADD(a.data_horario, INTERVAL 1 MONTH)
          AND a.logi = 'LOGIN'
          AND b.logi = 'LOGIN'
    )
  AND a.logi = 'LOGIN';

    """, nativeQuery = true)
    fun findUsuariosQueRetornaramAposUmMes(): Int
}

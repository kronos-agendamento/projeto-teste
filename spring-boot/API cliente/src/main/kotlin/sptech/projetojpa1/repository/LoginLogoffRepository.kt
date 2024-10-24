package sptech.projetojpa1.repository

import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository
import sptech.projetojpa1.domain.LoginLogoff

@Repository
interface LoginLogoffRepository : CrudRepository<LoginLogoff, Int> {

    @Query(value = """
        SELECT 
    a.fk_usuario,
    MIN(a.data_horario) AS primeiro_login,
    MIN(b.data_horario) AS retorno_login
FROM 
    login_logoff a
JOIN 
    login_logoff b
    ON a.fk_usuario = b.fk_usuario
    AND b.data_horario > a.data_horario
WHERE 
    a.logi = 'LOGIN'
    AND b.logi = 'LOGIN'
    AND b.data_horario >= DATE_ADD(a.data_horario, INTERVAL 1 MONTH)
GROUP BY 
    a.fk_usuario
HAVING 
    retorno_login IS NOT NULL;


    """, nativeQuery = true)
    fun findUsuariosQueRetornaramAposUmMes(): Int
}

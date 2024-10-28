package sptech.projetojpa1.repository

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import sptech.projetojpa1.domain.FichaAnamnese
import java.time.LocalDate
import sptech.projetojpa1.repository.UsuarioRepository

// Repositório para a entidade FichaAnamnese
interface FichaAnamneseRepository : JpaRepository<FichaAnamnese, Int> {

    @Query(
        """
        SELECT f FROM FichaAnamnese f
        JOIN f.usuario u
        WHERE (:nomeUsuario IS NULL OR u.nome LIKE %:nomeUsuario%)
        AND (:cpf IS NULL OR u.cpf = :cpf)
        AND (:dataPreenchimento IS NULL OR f.dataPreenchimento = :dataPreenchimento)
    """
    )
    fun findByFilters(
        @Param("nomeUsuario") nomeUsuario: String?,
        @Param("cpf") cpf: String?,
        @Param("dataPreenchimento") dataPreenchimento: LocalDate?
    ): List<FichaAnamnese>
}

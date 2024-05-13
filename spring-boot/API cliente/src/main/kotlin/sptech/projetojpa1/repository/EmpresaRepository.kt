package sptech.projetojpa1.repository

import org.hibernate.validator.constraints.br.CNPJ
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import sptech.projetojpa1.dominio.Empresa

// Interface para acesso aos dados da entidade Empresa
interface EmpresaRepository : JpaRepository<Empresa, Int> {

    // Método para buscar uma empresa pelo CNPJ
    fun findByCNPJ(cnpj: String): List<Empresa>

    // Método para buscar empresas pelo nome, ignorando maiúsculas e minúsculas
    fun findByNomeContainsIgnoreCase(nome: String): List<Empresa>

    // Método para buscar uma empresa pelo nome, ignorando maiúsculas e minúsculas
    @Query("SELECT e FROM Empresa e WHERE UPPER(e.nome) LIKE %:nome%")
    fun buscarPeloNomeIgnoreCase(nome: String): Empresa?

    // Método para buscar uma empresa pelo CNPJ, usando uma consulta personalizada
    @Query("SELECT e FROM Empresa e WHERE e.CNPJ = :cnpj")
    fun buscarPeloCNPJ(@CNPJ cnpj: String): Empresa?

    // Método para excluir uma empresa pelo CNPJ
    fun deleteByCNPJ(cnpj: String)
}

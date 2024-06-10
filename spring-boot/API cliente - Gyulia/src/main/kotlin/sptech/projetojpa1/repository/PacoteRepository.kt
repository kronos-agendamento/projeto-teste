package sptech.projetojpa1.repository

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import sptech.projetojpa1.dominio.Pacote

@Repository
interface PacoteRepository : JpaRepository<Pacote, Int> {

    fun findByNomeContains(nome: String): List<Pacote>

//    @Query("SELECT p FROM Pacote p JOIN p.itens i WHERE i.servico = :especificacaoId")
//    fun findByEspecificacaoId(@Param("especificacaoId") especificacaoId: Int): List<Pacote>

    fun findByDescontoColocacaoBetween(min: Double, max: Double): List<Pacote>

    fun findByDescontoManutencaoBetween(min: Double, max: Double): List<Pacote>
}

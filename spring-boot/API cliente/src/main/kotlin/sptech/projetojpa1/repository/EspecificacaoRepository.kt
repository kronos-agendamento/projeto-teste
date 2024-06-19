package sptech.projetojpa1.repository

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import sptech.projetojpa1.dominio.Especificacao
import sptech.projetojpa1.dto.especificacao.EspecificacaoReceitaMensalDTO

interface EspecificacaoRepository : JpaRepository<Especificacao, Int> {
    //    fun findByFkProcedimentoDescricao(descricao: String): List<Especificacao>
    fun findByEspecificacaoContainsIgnoreCase(especificacao: String): Especificacao?

//    @Query("DELETE FROM Especificacao e WHERE lower(e.especificacao) = lower(:especificacao)")
//    fun deleteByEspecificacaoIgnoreCase(especificacao: String)

    @Query("SELECT e.foto FROM Especificacao e WHERE e.idEspecificacaoProcedimento = :codigo")
    fun findFotoByCodigo(codigo: Int): ByteArray?

    @Query(
        value = """
        SELECT 
SUM(ep.preco_colocacao + ep.preco_manutencao + ep.preco_retirada) AS receitaTotal 
FROM 
agendamento a 
INNER JOIN 
especificacao_procedimento ep 
ON 
a.fk_procedimento = ep.id_especificacao_procedimento 
WHERE 
a.data >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
GROUP BY 
DATE_FORMAT(a.data, '%Y-%m')
ORDER BY 
DATE_FORMAT(a.data, '%Y-%m');

    """, nativeQuery = true
    )
    fun findReceitaSemestralAcumulada(): List<Double>

    @Query(
        value = """
    SELECT 
    DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL seq MONTH), '%Y-%m') as month 
    FROM 
    (SELECT 0 as seq 
        UNION ALL SELECT 1 
        UNION ALL SELECT 2 
        UNION ALL SELECT 3 
        UNION ALL SELECT 4 
        UNION ALL SELECT 5) as sequence 
    ORDER BY month;
    """, nativeQuery = true
    )
    fun findMesesUltimosSeisMeses(): List<String>
}

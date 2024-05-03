package sptech.projetojpa1.repository

import org.hibernate.validator.constraints.br.CNPJ
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import sptech.projetojpa1.dominio.Complemento
import sptech.projetojpa1.dominio.Empresa

interface EmpresaRepository:JpaRepository<Empresa,Int> {


    fun findByCNPJ(cnpj: String):List<Empresa>
    fun findByNomeContainsIgnoreCase(nome: String):List<Empresa>
//    fun findByCNPJAndNome(cnpj: Long, nome: String): List<Empresa>

    @Query("SELECT e FROM Empresa e WHERE e.nome LIKE %:nome%")
    fun buscarPeloNome(nome: String): Empresa?

    @Query("SELECT e FROM Empresa e WHERE e.CNPJ LIKE %:cnpj%")
    fun buscarPeloCNPJ(cnpj: String): Empresa?

    fun findByNomeContaining(nome: String): List<Empresa>




}
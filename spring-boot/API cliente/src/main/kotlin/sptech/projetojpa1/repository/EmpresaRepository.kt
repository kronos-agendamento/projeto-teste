package sptech.projetojpa1.repository

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import sptech.projetojpa1.domain.Empresa

interface EmpresaRepository : JpaRepository<Empresa, Int> {
    fun findByCnpj(cnpj: String): Empresa?

    fun deleteByCnpj(cnpj: String)
}
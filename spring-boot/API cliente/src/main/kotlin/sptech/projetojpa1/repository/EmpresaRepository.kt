package sptech.projetojpa1.repository

import org.springframework.data.jpa.repository.JpaRepository
import sptech.projetojpa1.dominio.Empresa

interface EmpresaRepository:JpaRepository<Empresa,Int> {

    fun findByNomeContains(nome: String):List<Empresa>


}
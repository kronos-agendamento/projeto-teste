package sptech.projetojpa1.repository

import org.springframework.data.jpa.repository.JpaRepository
import sptech.projetojpa1.dominio.Cores

interface CoresRepository:JpaRepository<Cores, Int> {
    fun findByNome(nome:String):List<Cores>
}
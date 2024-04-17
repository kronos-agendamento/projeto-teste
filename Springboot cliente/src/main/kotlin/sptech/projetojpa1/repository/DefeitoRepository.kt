package sptech.projetojpa1.repository

import org.springframework.data.jpa.repository.JpaRepository
import sptech.projetojpa1.dominio.Defeito

interface DefeitoRepository:JpaRepository<Defeito, Int> {
    fun findByNome(nome:String):List<Defeito>
}
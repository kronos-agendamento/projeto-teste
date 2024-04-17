package sptech.projetojpa1.repository

import org.springframework.data.jpa.repository.JpaRepository
import sptech.projetojpa1.dominio.Defeito
import sptech.projetojpa1.dominio.Direcao

interface DirecaoRepository:JpaRepository<Direcao, Int> {
    fun findByNome(nome:String):List<Direcao>
}
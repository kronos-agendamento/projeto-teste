package sptech.projetojpa1.repository

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import sptech.projetojpa1.dominio.Complemento

interface ComplementoRepository: JpaRepository<Complemento, Int> {

    @Query("SELECT c FROM Complemento c WHERE c.endereco.id = :id")
    fun findByEnderecoId(id:Int):List<Complemento>
}
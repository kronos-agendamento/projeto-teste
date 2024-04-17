package sptech.projetojpa1.repository

import org.springframework.data.jpa.repository.JpaRepository
import sptech.projetojpa1.dominio.Cliente

interface ClienteRepository : JpaRepository<Cliente, Int>{
    fun findByNome(nome:String):List<Cliente>
    fun findByStatusTrue():List<Cliente>
}
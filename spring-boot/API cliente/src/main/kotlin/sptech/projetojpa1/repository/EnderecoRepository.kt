package sptech.projetojpa1.repository

import org.springframework.data.jpa.repository.JpaRepository
import sptech.projetojpa1.domain.Endereco

interface EnderecoRepository : JpaRepository<Endereco, Int> {

    fun findByCepContaining(cep: String): List<Endereco>
}
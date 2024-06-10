package sptech.projetojpa1.repository

import jakarta.transaction.Transactional
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query

interface PersonalidadeRepository {

    fun findByPersonalidade(personalidade: String): Int


}
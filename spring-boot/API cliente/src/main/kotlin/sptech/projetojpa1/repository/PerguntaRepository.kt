package sptech.projetojpa1.repository

import org.springframework.data.jpa.repository.JpaRepository
import sptech.projetojpa1.domain.Pergunta

interface PerguntaRepository : JpaRepository<Pergunta, Int> {

    fun findByAtiva(ativa: Boolean): List<Pergunta>
    fun findByAtivaFalse():List<Pergunta>
    fun findTop4ByAtivaTrue():List<Pergunta>
}
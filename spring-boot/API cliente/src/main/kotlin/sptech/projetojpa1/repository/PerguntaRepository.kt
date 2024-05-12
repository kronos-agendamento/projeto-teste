package sptech.projetojpa1.repository

import org.springframework.data.jpa.repository.JpaRepository
import sptech.projetojpa1.dominio.Pergunta

interface PerguntaRepository:JpaRepository<Pergunta,Int> {
    fun findByStatus(status: Boolean):List<Pergunta>
    fun findByDescricaoContainsIgnoreCase(descricao: String): List<Pergunta>
}
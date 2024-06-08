package sptech.projetojpa1.repository

import org.springframework.data.jpa.repository.JpaRepository
import sptech.projetojpa1.dominio.Comentario

interface ComentarioRepository : JpaRepository<Comentario, Int> {
    fun findByPublicacaoId(id: Int): List<Comentario>
}
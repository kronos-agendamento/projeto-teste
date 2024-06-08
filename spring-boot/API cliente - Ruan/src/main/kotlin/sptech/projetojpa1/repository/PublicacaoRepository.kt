package sptech.projetojpa1.repository

import org.springframework.data.jpa.repository.JpaRepository
import sptech.projetojpa1.dominio.Publicacao

interface PublicacaoRepository : JpaRepository<Publicacao, Int> {
    fun findByUsuarioCodigo(codigo: Int): List<Publicacao>
}

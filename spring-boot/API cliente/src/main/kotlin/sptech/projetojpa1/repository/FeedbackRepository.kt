package sptech.projetojpa1.repository

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import sptech.projetojpa1.dominio.Feedback
import sptech.projetojpa1.dominio.Usuario

@Repository
interface FeedbackRepository : JpaRepository<Feedback, Int>{
    fun deleteAllByUsuario(usuario: Usuario)
}
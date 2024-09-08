package sptech.projetojpa1.repository

import org.springframework.data.jpa.repository.JpaRepository
import sptech.projetojpa1.domain.Resposta
import sptech.projetojpa1.dominio.Usuario

interface RespostaRepository : JpaRepository<Resposta, Int> {

    fun findByUsuarioCpf(cpf: String): List<Resposta>

    fun deleteAllByUsuario(usuario: Usuario)
}
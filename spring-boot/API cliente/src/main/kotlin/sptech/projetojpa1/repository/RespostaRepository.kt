package sptech.projetojpa1.repository

import org.springframework.data.jpa.repository.JpaRepository
import sptech.projetojpa1.dominio.Resposta

interface RespostaRepository:JpaRepository<Resposta,Int> {
    fun findByUsuarioID(usuario:Usuario, Id:Int):List<Resposta>
    fun findByPergunta(pergunta:Pergunta):List<Resposta>
}
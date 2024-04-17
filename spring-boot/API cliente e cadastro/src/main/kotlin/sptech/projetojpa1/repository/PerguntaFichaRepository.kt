package sptech.projetojpa1.repository

import org.springframework.data.jpa.repository.JpaRepository
import sptech.projetojpa1.dominio.Cliente
import sptech.projetojpa1.dominio.PerguntaFicha

interface PerguntaFichaRepository:JpaRepository<PerguntaFicha,Int> {
    fun findByStatusTrue():List<PerguntaFicha>
}
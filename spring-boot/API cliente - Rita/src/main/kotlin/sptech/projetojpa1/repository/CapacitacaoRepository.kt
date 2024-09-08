package sptech.projetojpa1.repository

import org.springframework.data.jpa.repository.JpaRepository
import sptech.projetojpa1.dominio.Capacitacao

interface CapacitacaoRepository:JpaRepository<Capacitacao, Int> {

    // Função para buscar educativos por ativos
    fun findByAtivo(ativo: Boolean): List<Capacitacao>

}
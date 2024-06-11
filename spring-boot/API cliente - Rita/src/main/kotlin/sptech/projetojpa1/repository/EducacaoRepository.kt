package sptech.projetojpa1.repository

import org.springframework.data.jpa.repository.JpaRepository
import sptech.projetojpa1.dominio.Educacao
import sptech.projetojpa1.dominio.Pergunta
import sptech.projetojpa1.dto.educacao.EducacaoRequestDTO
import sptech.projetojpa1.dto.educacao.EducacaoResponseDTO

interface EducacaoRepository:JpaRepository<Educacao, Int> {

    // Função para buscar educativos por ativos
    fun findByAtivo(ativo: Boolean): List<Educacao>

}
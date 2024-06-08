package sptech.projetojpa1.repository

import org.springframework.data.jpa.repository.JpaRepository
import sptech.projetojpa1.dominio.Pergunta

// Interface responsável por acessar os dados da entidade Pergunta no banco de dados
interface PerguntaRepository : JpaRepository<Pergunta, Int> {

    // Função para buscar perguntas por status
    fun findByStatus(status: Boolean): List<Pergunta>

    // Função para buscar perguntas por descrição, ignorando maiúsculas e minúsculas
    fun findByDescricaoContainsIgnoreCase(descricao: String): List<Pergunta>
}

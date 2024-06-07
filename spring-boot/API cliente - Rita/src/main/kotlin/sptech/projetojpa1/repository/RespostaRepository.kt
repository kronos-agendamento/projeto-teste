package sptech.projetojpa1.repository

import org.springframework.data.jpa.repository.JpaRepository
import sptech.projetojpa1.dominio.Resposta

// Interface para acesso aos dados da entidade Resposta
interface RespostaRepository : JpaRepository<Resposta, Int> {

    // Método para encontrar respostas por CPF do usuário
    fun findByUsuarioCpf(cpf: String): List<Resposta>

    // Método para encontrar respostas por descrição da pergunta
    fun findByPerguntaDescricao(descricao: String): List<Resposta>
}

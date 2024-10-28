package sptech.projetojpa1.service

import org.springframework.stereotype.Service
import sptech.projetojpa1.domain.Pergunta
import sptech.projetojpa1.dto.pergunta.PerguntaCreateRequest
import sptech.projetojpa1.dto.pergunta.PerguntaResponse
import sptech.projetojpa1.dto.pergunta.PerguntaUpdateRequest
import sptech.projetojpa1.repository.PerguntaRepository

@Service
class PerguntaService(
    private val perguntaRepository: PerguntaRepository
) {
    fun criarPergunta(request: PerguntaCreateRequest): PerguntaResponse {
        val novaPergunta = Pergunta(
            pergunta = request.pergunta,
            ativa = request.ativa,
            tipo = request.tipo
        )
        val perguntaSalva = perguntaRepository.save(novaPergunta)
        return PerguntaResponse(
            idPergunta = perguntaSalva.idPergunta,
            pergunta = perguntaSalva.pergunta,
            ativa = perguntaSalva.ativa,
            tipo = perguntaSalva.tipo
        )
    }

    fun listarPerguntas(): List<PerguntaResponse> {
        return perguntaRepository.findAll().map { pergunta ->
            PerguntaResponse(
                idPergunta = pergunta.idPergunta,
                pergunta = pergunta.pergunta,
                ativa = pergunta.ativa,
                tipo = pergunta.tipo
            )
        }
    }

    fun listarPerguntasAtivas(ativa: Boolean): List<PerguntaResponse> {
        return perguntaRepository.findByAtiva(ativa).map { pergunta ->
            PerguntaResponse(
                idPergunta = pergunta.idPergunta,
                pergunta = pergunta.pergunta,
                ativa = pergunta.ativa,
                tipo = pergunta.tipo
            )
        }
    }

    fun listarPerguntasDesativadas(): List<Pergunta> {
        return perguntaRepository.findByAtivaFalse()
    }

    fun listarPerguntaPorId(id: Int): PerguntaResponse {
        val pergunta = perguntaRepository.findById(id)
            .orElseThrow { NoSuchElementException("Pergunta com id $id não encontrada") }
        return PerguntaResponse(
            idPergunta = pergunta.idPergunta,
            pergunta = pergunta.pergunta,
            ativa = pergunta.ativa,
            tipo = pergunta.tipo
        )
    }

    fun atualizarPergunta(id: Int, request: PerguntaUpdateRequest): PerguntaResponse {
        val pergunta = perguntaRepository.findById(id)
            .orElseThrow { NoSuchElementException("Pergunta com id $id não encontrada") }

        pergunta.pergunta = request.pergunta
        pergunta.ativa = request.ativa
        pergunta.tipo = request.tipo

        val perguntaAtualizada = perguntaRepository.save(pergunta)
        return PerguntaResponse(
            idPergunta = perguntaAtualizada.idPergunta,
            pergunta = perguntaAtualizada.pergunta,
            ativa = perguntaAtualizada.ativa,
            tipo = perguntaAtualizada.tipo
        )
    }

    fun excluirPergunta(id: Int) {
        if (!perguntaRepository.existsById(id)) {
            throw NoSuchElementException("Pergunta com id $id não encontrada")
        }
        perguntaRepository.deleteById(id)
    }

    fun desativarPergunta(id: Int): PerguntaResponse {
        // Busca a pergunta pelo id, caso não encontre lança uma exceção
        val pergunta = perguntaRepository.findById(id)
            .orElseThrow { NoSuchElementException("Pergunta com id $id não encontrada") }

        // Atualiza o campo ativa para false
        pergunta.ativa = false

        // Salva a pergunta atualizada no banco de dados
        val perguntaDesativada = perguntaRepository.save(pergunta)

        // Retorna a pergunta desativada como resposta
        return PerguntaResponse(
            idPergunta = perguntaDesativada.idPergunta,
            pergunta = perguntaDesativada.pergunta,
            ativa = perguntaDesativada.ativa,
            tipo = perguntaDesativada.tipo
        )
    }

    fun ativarPergunta(id: Int): PerguntaResponse {
        // Busca a pergunta pelo id, caso não encontre lança uma exceção
        val pergunta = perguntaRepository.findById(id)
            .orElseThrow { NoSuchElementException("Pergunta com id $id não encontrada") }

        // Atualiza o campo ativa para true
        pergunta.ativa = true

        // Salva a pergunta atualizada no banco de dados
        val perguntaAtivada = perguntaRepository.save(pergunta)

        // Retorna a pergunta ativada como resposta
        return PerguntaResponse(
            idPergunta = perguntaAtivada.idPergunta,
            pergunta = perguntaAtivada.pergunta,
            ativa = perguntaAtivada.ativa,
            tipo = perguntaAtivada.tipo
        )
    }
}
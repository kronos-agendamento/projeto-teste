package sptech.projetojpa1.service

import org.springframework.stereotype.Service
import sptech.projetojpa1.domain.Pergunta
import sptech.projetojpa1.dto.pergunta.PerguntaCreateRequest
import sptech.projetojpa1.dto.pergunta.PerguntaResponse
import sptech.projetojpa1.dto.pergunta.PerguntaUpdateRequest
import sptech.projetojpa1.repository.PerguntaRepository
import java.util.NoSuchElementException

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

    fun listarPrimeirasPerguntasAtivas():List<PerguntaResponse>{
        val perguntasAtivas = perguntaRepository.findTop4ByAtivaTrue()

        return perguntasAtivas.map { pergunta ->
            PerguntaResponse(
                idPergunta = pergunta.idPergunta,
                pergunta = pergunta.pergunta,
                ativa = pergunta.ativa
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
}
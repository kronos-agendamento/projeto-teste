package sptech.projetojpa1.service

import org.springframework.stereotype.Service
import sptech.projetojpa1.dominio.Pergunta
import sptech.projetojpa1.dto.pergunta.PerguntaAttRequest
import sptech.projetojpa1.dto.pergunta.PerguntaRequest
import sptech.projetojpa1.repository.PerguntaRepository

@Service
class PerguntaService(
    val perguntaRepository: PerguntaRepository
) {
    fun cadastrarPergunta(novaPerguntaDTO: PerguntaRequest): PerguntaRequest {
        val novaPergunta = Pergunta(
            codigoPergunta = 0,
            descricao = novaPerguntaDTO.descricao,
            tipo = novaPerguntaDTO.tipo,
            status = false
        )
        val perguntaSalva = perguntaRepository.save(novaPergunta)
        return PerguntaRequest(
            codigoPergunta = perguntaSalva.codigoPergunta,
            descricao = perguntaSalva.descricao,
            tipo = perguntaSalva.tipo,
            status = perguntaSalva.status
        )
    }

    fun listarTodasPerguntas(): List<PerguntaRequest> {
        return perguntaRepository.findAll().map { pergunta ->
            PerguntaRequest(
                codigoPergunta = pergunta.codigoPergunta,
                descricao = pergunta.descricao,
                tipo = pergunta.tipo,
                status = pergunta.status
            )
        }
    }

    fun buscarPorDescricao(descricao: String): List<PerguntaRequest> {
        return perguntaRepository.findByDescricaoContainsIgnoreCase(descricao).map { pergunta ->
            PerguntaRequest(
                codigoPergunta = pergunta.codigoPergunta,
                descricao = pergunta.descricao,
                tipo = pergunta.tipo,
                status = pergunta.status
            )
        }
    }

    fun listarPerguntasAtivas(status: Boolean): List<PerguntaRequest> {
        return perguntaRepository.findByStatus(status).map { pergunta ->
            PerguntaRequest(
                codigoPergunta = pergunta.codigoPergunta,
                descricao = pergunta.descricao,
                tipo = pergunta.tipo,
                status = pergunta.status
            )
        }
    }

    fun alterarStatusPergunta(id: Int, novoStatus: Boolean): PerguntaRequest? {
        val perguntaOptional = perguntaRepository.findById(id)
        if (perguntaOptional.isPresent) {
            val pergunta = perguntaOptional.get()
            pergunta.status = novoStatus
            val perguntaSalva = perguntaRepository.save(pergunta)
            return PerguntaRequest(
                codigoPergunta = perguntaSalva.codigoPergunta,
                descricao = perguntaSalva.descricao,
                tipo = perguntaSalva.tipo,
                status = perguntaSalva.status
            )
        }
        return null
    }

    fun editarDescricaoPergunta(id: Int, novaDescricao: String): PerguntaAttRequest? {
        val perguntaOptional = perguntaRepository.findById(id)
        if (perguntaOptional.isPresent) {
            val pergunta = perguntaOptional.get()
            pergunta.descricao = novaDescricao
            val perguntaSalva = perguntaRepository.save(pergunta)
            return PerguntaAttRequest(
                descricao = perguntaSalva.descricao,
                tipo = perguntaSalva.tipo,
            )
        }
        return null
    }

    // Get do César
    fun listarPerguntasPersonalidade(): List<Pergunta> {

        return perguntaRepository.findByTipo("personalidade")
    }
}

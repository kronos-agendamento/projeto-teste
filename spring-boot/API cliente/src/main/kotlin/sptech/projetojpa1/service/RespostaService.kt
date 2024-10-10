package sptech.projetojpa1.service

import org.springframework.stereotype.Service
import sptech.projetojpa1.domain.Resposta
import sptech.projetojpa1.dto.resposta.RespostaBatchRequestDTO
import sptech.projetojpa1.dto.resposta.RespostaFilteredDTO
import sptech.projetojpa1.dto.resposta.RespostaRequestDTO
import sptech.projetojpa1.dto.resposta.RespostaResponseDTO
import sptech.projetojpa1.repository.FichaAnamneseRepository
import sptech.projetojpa1.repository.PerguntaRepository
import sptech.projetojpa1.repository.RespostaRepository
import sptech.projetojpa1.repository.UsuarioRepository

@Service
class RespostaService(
    private val respostaRepository: RespostaRepository,
    private val perguntaRepository: PerguntaRepository,
    private val fichaAnamneseRepository: FichaAnamneseRepository,
    private val usuarioRepository: UsuarioRepository
) {

    fun criarRespostas(request: RespostaBatchRequestDTO): List<RespostaResponseDTO> {
        val fichaAnamnese = fichaAnamneseRepository.findById(request.fichaAnamnese)
            .orElseThrow { IllegalArgumentException("Ficha não encontrada") }
        val usuario = usuarioRepository.findById(request.usuario)
            .orElseThrow { IllegalArgumentException("Usuário não encontrado") }

        val respostasSalvas = request.respostas.map { respostaRequest ->
            val pergunta = perguntaRepository.findById(respostaRequest.pergunta)
                .orElseThrow { IllegalArgumentException("Pergunta não encontrada") }

            val resposta = Resposta(
                resposta = respostaRequest.resposta,
                pergunta = pergunta,
                fichaAnamnese = fichaAnamnese,
                usuario = usuario
            )

            respostaRepository.save(resposta)
        }

        return respostasSalvas.map { respostaSalva ->
            RespostaResponseDTO(
                idResposta = respostaSalva.idResposta!!,
                resposta = respostaSalva.resposta,
                pergunta = respostaSalva.pergunta.pergunta,
                usuario = respostaSalva.usuario.nome ?: "",
                dataPreenchimento = respostaSalva.fichaAnamnese.dataPreenchimento.toString()
            )
        }
    }


    fun listarRespostas(): List<RespostaResponseDTO> {
        val respostas = respostaRepository.findAll()
        return respostas.map { resposta ->
            RespostaResponseDTO(
                idResposta = resposta.idResposta!!,
                resposta = resposta.resposta,
                pergunta = resposta.pergunta.pergunta,
                usuario = resposta.usuario.nome ?: "",
                dataPreenchimento = resposta.fichaAnamnese.dataPreenchimento.toString()
            )
        }
    }

    fun buscarRespostaPorId(id: Int): RespostaResponseDTO {
        val resposta = respostaRepository.findById(id)
            .orElseThrow { IllegalArgumentException("Resposta não encontrada para o ID fornecido.") }

        return RespostaResponseDTO(
            idResposta = resposta.idResposta!!,
            resposta = resposta.resposta,
            pergunta = resposta.pergunta.pergunta,
            usuario = resposta.usuario.nome ?: "",
            dataPreenchimento = resposta.fichaAnamnese.dataPreenchimento.toString()
        )
    }

    fun atualizarResposta(id: Int, request: RespostaRequestDTO): RespostaResponseDTO {
        val resposta = respostaRepository.findById(id)
            .orElseThrow { IllegalArgumentException("Resposta não encontrada para o ID fornecido.") }

        val pergunta = perguntaRepository.findById(request.pergunta)
            .orElseThrow { IllegalArgumentException("Pergunta não encontrada") }
        val ficha = fichaAnamneseRepository.findById(request.fichaAnamnese)
            .orElseThrow { IllegalArgumentException("Ficha não encontrada") }
        val usuario = usuarioRepository.findById(request.usuario)
            .orElseThrow { IllegalArgumentException("Usuário não encontrado") }

        resposta.resposta = request.resposta
        resposta.pergunta = pergunta
        resposta.fichaAnamnese = ficha
        resposta.usuario = usuario

        val respostaAtualizada = respostaRepository.save(resposta)

        return RespostaResponseDTO(
            idResposta = respostaAtualizada.idResposta!!,
            resposta = respostaAtualizada.resposta,
            pergunta = respostaAtualizada.pergunta.pergunta,
            usuario = respostaAtualizada.usuario.nome ?: "",
            dataPreenchimento = respostaAtualizada.fichaAnamnese.dataPreenchimento.toString()
        )
    }

    fun filtrarPorCpf(cpf: String): List<RespostaFilteredDTO> {
        val respostas = respostaRepository.findByUsuarioCpf(cpf)
        return respostas.map { resposta ->
            RespostaFilteredDTO(
                resposta = resposta.resposta,
                pergunta = resposta.pergunta.pergunta,
                usuario = resposta.usuario.nome ?: "",
                dataPreenchimento = resposta.fichaAnamnese.dataPreenchimento.toString()
            )
        }
    }

    fun deletarResposta(id: Int): Boolean {
        return if (respostaRepository.existsById(id)) {
            respostaRepository.deleteById(id)
            true
        } else {
            false
        }
    }
}
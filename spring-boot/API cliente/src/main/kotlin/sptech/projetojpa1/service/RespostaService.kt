package sptech.projetojpa1.service

import org.springframework.stereotype.Service
import sptech.projetojpa1.dto.resposta.RespostaRequestDTO
import sptech.projetojpa1.dto.resposta.RespostaResponseDTO
import sptech.projetojpa1.dto.resposta.RespostaFilteredDTO
import sptech.projetojpa1.dominio.Resposta
import sptech.projetojpa1.repository.RespostaRepository
import sptech.projetojpa1.repository.PerguntaRepository
import sptech.projetojpa1.repository.FichaAnamneseRepository
import sptech.projetojpa1.repository.UsuarioRepository

@Service
class RespostaService(
    private val respostaRepository: RespostaRepository,
    private val perguntaRepository: PerguntaRepository,
    private val fichaAnamneseRepository: FichaAnamneseRepository,
    private val usuarioRepository: UsuarioRepository
) {

    fun cadastrarResposta(novaResposta: RespostaRequestDTO): RespostaResponseDTO {
        val pergunta = perguntaRepository.findById(novaResposta.perguntaId)
            .orElseThrow { IllegalArgumentException("Pergunta não encontrada") }
        val ficha = fichaAnamneseRepository.findById(novaResposta.fichaId)
            .orElseThrow { IllegalArgumentException("Ficha não encontrada") }
        val usuario = usuarioRepository.findById(novaResposta.usuarioId)
            .orElseThrow { IllegalArgumentException("Usuário não encontrado") }

        val resposta = Resposta(
            resposta = novaResposta.resposta,
            pergunta = pergunta,
            ficha = ficha,
            usuario = usuario
        )

        val respostaSalva = respostaRepository.save(resposta)

        return RespostaResponseDTO(
            id = respostaSalva.codigoRespostaFichaUsuario!!,
            resposta = respostaSalva.resposta,
            perguntaDescricao = respostaSalva.pergunta.descricao,
            perguntaTipo = respostaSalva.pergunta.tipo,
            usuarioNome = respostaSalva.usuario.nome ?: "",
            usuarioCpf = respostaSalva.usuario.cpf ?: "",
            fichaDataPreenchimento = respostaSalva.ficha.dataPreenchimento.toString()
        )
    }

    fun listarTodasRespostas(): List<RespostaResponseDTO> {
        val respostas = respostaRepository.findAll()
        return respostas.map { resposta ->
            RespostaResponseDTO(
                id = resposta.codigoRespostaFichaUsuario!!,
                resposta = resposta.resposta,
                perguntaDescricao = resposta.pergunta.descricao,
                perguntaTipo = resposta.pergunta.tipo,
                usuarioNome = resposta.usuario.nome ?: "",
                usuarioCpf = resposta.usuario.cpf ?: "",
                fichaDataPreenchimento = resposta.ficha.dataPreenchimento.toString()
            )
        }
    }

    fun filtrarPorCpf(cpf: String): List<RespostaFilteredDTO> {
        val respostas = respostaRepository.findByUsuarioCpf(cpf)
        return respostas.map { resposta ->
            RespostaFilteredDTO(
                resposta = resposta.resposta,
                nomeUsuario = resposta.usuario.nome ?: "",
                cpfUsuario = resposta.usuario.cpf ?: "",
                dataPreenchimentoFicha = resposta.ficha.dataPreenchimento.toString()
            )
        }
    }

    fun filtrarPorPergunta(descricao: String): List<RespostaFilteredDTO> {
        val respostas = respostaRepository.findByPerguntaDescricao(descricao)
        return respostas.map { resposta ->
            RespostaFilteredDTO(
                resposta = resposta.resposta,
                descricaoPergunta = resposta.pergunta.descricao,
                tipoPergunta = resposta.pergunta.tipo,
                nomeUsuario = resposta.usuario.nome ?: "",
                cpfUsuario = resposta.usuario.cpf ?: "",
                dataPreenchimentoFicha = resposta.ficha.dataPreenchimento.toString()
            )
        }
    }

    fun excluirResposta(id: Int): Boolean {
        val respostaOptional = respostaRepository.findById(id)
        return if (respostaOptional.isPresent) {
            respostaRepository.deleteById(id)
            true
        } else {
            false
        }
    }
}

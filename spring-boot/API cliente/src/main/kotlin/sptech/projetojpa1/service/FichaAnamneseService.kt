package sptech.projetojpa1.service

import org.springframework.stereotype.Service
import sptech.projetojpa1.domain.FichaAnamnese
import sptech.projetojpa1.dto.FichaCompletaResponseDTO
import sptech.projetojpa1.dto.ficha.FichaRequest
import sptech.projetojpa1.dto.ficha.PerguntaRespostaAtualizacao
import sptech.projetojpa1.dto.ficha.PerguntaRespostaDTO
import sptech.projetojpa1.repository.FichaAnamneseRepository
import sptech.projetojpa1.repository.UsuarioRepository
import java.time.LocalDate

@Service
data class FichaAnamneseService(
    val fichaAnamneseRepository: FichaAnamneseRepository,
    val usuarioRepository: UsuarioRepository
) {
    fun cadastrarFichaAnamnese(novaFichaAnamneseDTO: FichaRequest): FichaCompletaResponseDTO {
        val novaFichaAnamnese = FichaAnamnese(
            codigoFicha = null,
            dataPreenchimento = novaFichaAnamneseDTO.dataPreenchimento,
            usuario = novaFichaAnamneseDTO.usuario
        )
        val fichaAnamneseSalva = fichaAnamneseRepository.save(novaFichaAnamnese)
        return FichaCompletaResponseDTO(
            codigoFicha = fichaAnamneseSalva.codigoFicha,
            dataPreenchimento = fichaAnamneseSalva.dataPreenchimento,
            usuarioId = fichaAnamneseSalva.usuario?.codigo,
            usuarioNome = fichaAnamneseSalva.usuario?.nome,
            perguntasRespostas = emptyList()
        )
    }

    fun listarFichasAnamnese(): List<FichaCompletaResponseDTO> {
        return fichaAnamneseRepository.findAll().map { ficha ->
            val perguntasRespostas = ficha.respostas.map { resposta ->
                PerguntaRespostaDTO(
                    pergunta = resposta.pergunta.pergunta,
                    resposta = resposta.resposta
                )
            }

            FichaCompletaResponseDTO(
                codigoFicha = ficha.codigoFicha,
                dataPreenchimento = ficha.dataPreenchimento,
                usuarioId = ficha.usuario?.codigo,
                usuarioNome = ficha.usuario?.nome,
                perguntasRespostas = perguntasRespostas
            )
        }
    }

    fun buscarFichaPorId(id: Long): FichaCompletaResponseDTO {
        val ficha = fichaAnamneseRepository.findById(id.toInt())
            .orElseThrow { NoSuchElementException("Ficha Anamnese com ID $id não encontrada") }

        // Verifique se as respostas estão sendo carregadas
        val perguntasRespostas = ficha.respostas.map { resposta ->
            PerguntaRespostaDTO(
                idPergunta = resposta.pergunta.idPergunta,
                pergunta = resposta.pergunta.pergunta,
                perguntaTipo = resposta.pergunta.tipo,
                resposta = resposta.resposta
            )
        }

        return FichaCompletaResponseDTO(
            codigoFicha = ficha.codigoFicha,
            dataPreenchimento = ficha.dataPreenchimento,
            usuarioId = ficha.usuario?.codigo,
            usuarioNome = ficha.usuario?.nome,
            usuarioCpf = ficha.usuario?.cpf,
            perguntasRespostas = perguntasRespostas
        )
    }


    fun atualizarPerguntasRespostas(
        idFicha: Long,
        perguntasRespostas: List<PerguntaRespostaAtualizacao>
    ): FichaCompletaResponseDTO {
        // Busca a ficha de anamnese existente pelo ID fornecido
        val fichaExistente = fichaAnamneseRepository.findById(idFicha.toInt())
            .orElseThrow { NoSuchElementException("Ficha Anamnese com ID $idFicha não encontrada") }

        // Para cada atualização, encontra a pergunta e atualiza a resposta
        perguntasRespostas.forEach { atualizacao ->
            val respostaExistente =
                fichaExistente.respostas.find { it.pergunta.idPergunta == atualizacao.idPergunta.toInt() }
                    ?: throw NoSuchElementException("Pergunta com ID ${atualizacao.idPergunta} não encontrada na ficha de anamnese com ID $idFicha")

            // Atualiza a resposta da pergunta específica
            respostaExistente.resposta = atualizacao.resposta
        }

        // Salva a ficha atualizada no repositório
        val fichaAtualizada = fichaAnamneseRepository.save(fichaExistente)

        // Retorna a ficha completa como DTO
        return FichaCompletaResponseDTO(
            codigoFicha = fichaAtualizada.codigoFicha,
            dataPreenchimento = fichaAtualizada.dataPreenchimento,
            usuarioId = fichaAtualizada.usuario?.codigo,
            usuarioNome = fichaAtualizada.usuario?.nome,
            perguntasRespostas = fichaAtualizada.respostas.map { resposta ->
                PerguntaRespostaDTO(
                    pergunta = resposta.pergunta.pergunta,
                    perguntaTipo = resposta.pergunta.tipo,
                    resposta = resposta.resposta,
                    idPergunta = resposta.pergunta.idPergunta
                )
            }
        )
    }

    fun buscarFichasPorFiltros(
        nomeUsuario: String?,
        cpf: String?,
        dataPreenchimento: LocalDate?,
        usuarioId: Int?
    ): List<FichaCompletaResponseDTO> {
        val fichas = fichaAnamneseRepository.findByFilters(nomeUsuario, cpf, dataPreenchimento, usuarioId)

        return fichas.map { ficha ->
            FichaCompletaResponseDTO(
                codigoFicha = ficha.codigoFicha,
                dataPreenchimento = ficha.dataPreenchimento,
                usuarioId = ficha.usuario?.codigo,
                usuarioNome = ficha.usuario?.nome,
                usuarioCpf = ficha.usuario?.cpf,
                perguntasRespostas = ficha.respostas.map { resposta ->
                    PerguntaRespostaDTO(
                        pergunta = resposta.pergunta.pergunta,
                        perguntaTipo = resposta.pergunta.tipo,
                        resposta = resposta.resposta
                    )
                }
            )
        }
    }
}
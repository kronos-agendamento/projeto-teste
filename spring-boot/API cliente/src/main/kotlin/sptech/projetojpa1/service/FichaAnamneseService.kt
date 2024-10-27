package sptech.projetojpa1.service

import org.springframework.stereotype.Service
import sptech.projetojpa1.domain.FichaAnamnese
import sptech.projetojpa1.dto.FichaCompletaResponseDTO
import sptech.projetojpa1.dto.ficha.FichaRequest
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
            .orElseThrow { NoSuchElementException("Ficha Anamnese com ID $id nÃ£o encontrada") }

        val perguntasRespostas = ficha.respostas.map { resposta ->
            PerguntaRespostaDTO(
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

    fun atualizarFichaPorId(id: Long, fichaRequest: FichaRequest): FichaCompletaResponseDTO {
        val fichaExistente = fichaAnamneseRepository.findById(id.toInt())
            .orElseThrow { NoSuchElementException("Ficha Anamnese com ID $id não encontrada") }

        // Busca o usuário pelo ID fornecido
        val usuario = usuarioRepository.findById(fichaRequest.usuarioId)
            .orElseThrow { NoSuchElementException("Usuário com ID ${fichaRequest.usuarioId} não encontrado") }

        // Atualiza os campos da FichaAnamnese com os novos valores de fichaRequest
        fichaExistente.dataPreenchimento = fichaRequest.dataPreenchimento
        fichaExistente.usuario = usuario

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
                    resposta = resposta.resposta
                )
            }
        )
    }

    fun buscarFichasPorFiltros(
        nomeUsuario: String?,
        cpf: String?,
        dataPreenchimento: LocalDate?
    ): List<FichaCompletaResponseDTO> {
        val fichas = fichaAnamneseRepository.findByFilters(nomeUsuario, cpf, dataPreenchimento)

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
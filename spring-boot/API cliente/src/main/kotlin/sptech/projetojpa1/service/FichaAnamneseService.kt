package sptech.projetojpa1.service

import org.springframework.stereotype.Service
import sptech.projetojpa1.domain.FichaAnamnese
import sptech.projetojpa1.dto.FichaCompletaResponseDTO
import sptech.projetojpa1.dto.ficha.FichaRequest
import sptech.projetojpa1.dto.ficha.PerguntaRespostaDTO
import sptech.projetojpa1.repository.FichaAnamneseRepository
import java.time.LocalDate

@Service
data class FichaAnamneseService(
    val fichaAnamneseRepository: FichaAnamneseRepository
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

package sptech.projetojpa1.service

import org.springframework.stereotype.Service
import sptech.projetojpa1.domain.FichaAnamnese
import sptech.projetojpa1.dto.FichaCompletaResponseDTO
import sptech.projetojpa1.dto.FichaRequest
import sptech.projetojpa1.dto.ficha.PerguntaRespostaDTO
import sptech.projetojpa1.repository.FichaAnamneseRepository

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
            // Obtenha as perguntas e respostas associadas à ficha
            val perguntasRespostas = ficha.respostas.map { resposta ->
                PerguntaRespostaDTO(
                    pergunta = resposta.pergunta.pergunta,
                    resposta = resposta.resposta
                )
            }

            // Retorne a ficha com as perguntas, respostas e informações do usuário
            FichaCompletaResponseDTO(
                codigoFicha = ficha.codigoFicha,
                dataPreenchimento = ficha.dataPreenchimento,
                usuarioId = ficha.usuario?.codigo,
                usuarioNome = ficha.usuario?.nome,
                perguntasRespostas = perguntasRespostas
            )
        }
    }

}

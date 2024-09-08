package sptech.projetojpa1.service

import org.springframework.stereotype.Service
import sptech.projetojpa1.domain.Mensagem
import sptech.projetojpa1.dto.mensagem.MensagemRequestDTO
import sptech.projetojpa1.dto.mensagem.MensagemResponseDTO
import sptech.projetojpa1.repository.MensagemRepository

@Service
class MensagemService (private val repository: MensagemRepository) {

    fun createMensagem(mensagemCreateDTO:MensagemRequestDTO):MensagemResponseDTO {
        val mensagem = Mensagem(
            id = null,
            descricao = mensagemCreateDTO.descricao
        )
        val savedMensagem = repository.save(mensagem)
        return MensagemResponseDTO(savedMensagem.id, savedMensagem.descricao)
    }
}
package sptech.projetojpa1.service

import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import sptech.projetojpa1.dominio.NivelAcesso
import sptech.projetojpa1.dto.nivelacesso.NivelAcessoCreateDTO
import sptech.projetojpa1.dto.nivelacesso.NivelAcessoResponseDTO
import sptech.projetojpa1.dto.nivelacesso.NivelAcessoUpdateDTO
import sptech.projetojpa1.repository.NivelAcessoRepository
import java.util.Optional

@Service
class NivelAcessoService(
    private val repository: NivelAcessoRepository
) {

    fun cadastrarNivelAcesso(dto: NivelAcessoCreateDTO): NivelAcessoResponseDTO {
        val nivelAcesso = NivelAcesso(
            codigo = null,
            nome = dto.nome,
            nivel = dto.nivel,
            descricao = dto.descricao
        )
        val saved = repository.save(nivelAcesso)
        return NivelAcessoResponseDTO(saved.codigo!!, saved.nome!!, saved.nivel!!, saved.descricao!!)
    }

    fun listarNiveisAcesso(): List<NivelAcessoResponseDTO> {
        return repository.findAll().map {
            NivelAcessoResponseDTO(it.codigo!!, it.nome!!, it.nivel!!, it.descricao!!)
        }
    }

    fun atualizarNomeNivelAcesso(id: Int, dto: NivelAcessoUpdateDTO): ResponseEntity<String> {
        val optionalNivelAcesso: Optional<NivelAcesso> = repository.findById(id)
        return if (optionalNivelAcesso.isPresent) {
            val nivelAcesso = optionalNivelAcesso.get()
            nivelAcesso.nome = dto.nome
            repository.save(nivelAcesso)
            ResponseEntity.status(200).body("Nome atualizado com sucesso")
        } else {
            ResponseEntity.status(404).body("Nível de acesso não encontrado para o ID fornecido")
        }
    }

    fun excluirNivelAcesso(id: Int): ResponseEntity<String> {
        val optionalNivelAcesso: Optional<NivelAcesso> = repository.findById(id)
        return if (optionalNivelAcesso.isPresent) {
            repository.deleteById(id)
            ResponseEntity.status(200).body("Nível de acesso excluído com sucesso")
        } else {
            ResponseEntity.status(404).body("Nível de acesso não encontrado para o ID fornecido")
        }
    }
}

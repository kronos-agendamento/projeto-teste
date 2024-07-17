package sptech.projetojpa1.service

import org.springframework.stereotype.Service
import sptech.projetojpa1.dominio.Capacitacao
import sptech.projetojpa1.dto.capacitacao.CapacitacaoDTO
import sptech.projetojpa1.dto.capacitacao.CapacitacaoPutDTO
import sptech.projetojpa1.dto.capacitacao.CapacitacaoRequestDTO
import sptech.projetojpa1.dto.capacitacao.CapacitacaoResponseDTO
import sptech.projetojpa1.repository.CapacitacaoRepository
import java.util.stream.Collectors

@Service
class CapacitacaoService(private val capacitacaoRepository: CapacitacaoRepository) {

    fun criarCapacitacao(capacitacaoRequestDTO: CapacitacaoRequestDTO): CapacitacaoDTO {
        val capacitacao = capacitacaoRepository.save(
            Capacitacao(
                nome = capacitacaoRequestDTO.nome,
                descricao = capacitacaoRequestDTO.descricao!!,
                nivel = capacitacaoRequestDTO.nivel,
                modalidade = capacitacaoRequestDTO.modalidade,
                cargaHoraria = capacitacaoRequestDTO.cargaHoraria,
                precoCapacitacao = capacitacaoRequestDTO.precoCapacitacao,
                ativo = capacitacaoRequestDTO.ativo
            )
        )
        return capacitacao.toDTO()
    }

    fun listarTodasCapacitacoes(): List<CapacitacaoResponseDTO> {
        val capacitacao = capacitacaoRepository.findAll()
        return capacitacao.stream().map { capacitacao -> capacitacao.toResponseDTO() }.collect(Collectors.toList())
    }

    fun listarCapacitacoesAtivas(ativo: Boolean): List<Capacitacao> {
        return capacitacaoRepository.findByAtivo(ativo).map { capacitacao ->
            Capacitacao(
                idCapacitacao = capacitacao.idCapacitacao,
                nome = capacitacao.nome,
                descricao = capacitacao.descricao,
                nivel = capacitacao.nivel,
                modalidade = capacitacao.modalidade,
                cargaHoraria = capacitacao.cargaHoraria,
                precoCapacitacao = capacitacao.precoCapacitacao,
                ativo = capacitacao.ativo
            )
        }
    }

    fun buscarCapacitacaoPorId(idCapacitacao: Int): CapacitacaoResponseDTO? {
        val capacitacao = capacitacaoRepository.findById(idCapacitacao).orElse(null) ?: return null
        return capacitacao.toResponseDTO()
    }

    fun atualizarCapacitacao(id: Int, capacitacaoRequestDTO: CapacitacaoPutDTO): CapacitacaoResponseDTO? {
        val capacitacao = capacitacaoRepository.findById(id).orElse(null) ?: return null

        if (capacitacaoRequestDTO.nome != null) {
            capacitacao.nome = capacitacaoRequestDTO.nome
        }
        if (capacitacaoRequestDTO.descricao != null) {
            capacitacao.descricao = capacitacaoRequestDTO.descricao!!
        }
        if (capacitacaoRequestDTO.nivel != null) {
            capacitacao.nivel = capacitacaoRequestDTO.nivel!!
        }
        if (capacitacaoRequestDTO.modalidade != null) {
            capacitacao.modalidade = capacitacaoRequestDTO.modalidade
        }
        if (capacitacaoRequestDTO.cargaHoraria != null) {
            capacitacao.cargaHoraria = capacitacaoRequestDTO.cargaHoraria!!
        }
        if (capacitacaoRequestDTO.precoCapacitacao != null) {
            capacitacao.precoCapacitacao = capacitacaoRequestDTO.precoCapacitacao!!
        }

        val updatedCapacitacao = capacitacaoRepository.save(capacitacao)
        return updatedCapacitacao.toResponseDTO()
    }

    fun desativarCapacitacao(id: Int): Boolean {
        val capacitacaoOptional = capacitacaoRepository.findById(id)
        if (capacitacaoOptional.isPresent) {
            val capacitacao = capacitacaoOptional.get()
            capacitacao.ativo = false
            capacitacaoRepository.save(capacitacao)
            return true
        }
        return false
    }

    fun alterarStatusCapacitacao(id: Int, novoStatus: Boolean): CapacitacaoRequestDTO? {
        val capacitacaoOptional = capacitacaoRepository.findById(id)
        if (capacitacaoOptional.isPresent) {
            val capacitacao = capacitacaoOptional.get()
            capacitacao.ativo = novoStatus
            val capacitacaoSalva = capacitacaoRepository.save(capacitacao)
            return CapacitacaoRequestDTO(
                idCapacitacao = capacitacaoSalva.idCapacitacao,
                nome = capacitacaoSalva.nome,
                descricao = capacitacaoSalva.descricao,
                nivel = capacitacaoSalva.nivel,
                modalidade = capacitacaoSalva.modalidade,
                cargaHoraria = capacitacaoSalva.cargaHoraria,
                precoCapacitacao = capacitacaoSalva.precoCapacitacao,
                ativo = capacitacaoSalva.ativo
            )
        }
        return null
    }

    fun excluirCapacitacao(id: Int) {
        if (!capacitacaoRepository.existsById(id)) {
            throw IllegalArgumentException("Capacitação não encontrada!")
        }
        capacitacaoRepository.deleteById(id)
    }

    private fun Capacitacao.toDTO() = CapacitacaoDTO(
        idCapacitacao = this.idCapacitacao,
        nome = this.nome!!,
        descricao = this.descricao,
        nivel = this.nivel,
        modalidade = this.modalidade!!,
        cargaHoraria = this.cargaHoraria,
        precoCapacitacao = this.precoCapacitacao,
        ativo = this.ativo
    )

    private fun Capacitacao.toResponseDTO() = CapacitacaoResponseDTO(
        idCapacitacao = this.idCapacitacao,
        nome = this.nome!!,
        descricao = this.descricao,
        nivel = this.nivel,
        modalidade = this.modalidade!!,
        cargaHoraria = this.cargaHoraria,
        precoCapacitacao = this.precoCapacitacao,
        ativo = this.ativo
    )
}
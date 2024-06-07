package sptech.projetojpa1.service

import org.springframework.stereotype.Service
import sptech.projetojpa1.dominio.Educacao
import sptech.projetojpa1.dto.educacao.EducacaoDTO
import sptech.projetojpa1.dto.educacao.EducacaoRequestDTO
import sptech.projetojpa1.dto.educacao.EducacaoResponseDTO
import sptech.projetojpa1.dto.procedimento.ProcedimentoRequestDTO
import sptech.projetojpa1.dto.procedimento.ProcedimentoResponseDTO
import sptech.projetojpa1.repository.EducacaoRepository
import sptech.projetojpa1.repository.StatusRepository
import java.util.stream.Collectors

@Service
class EducacaoService (private val educacaoRepository: EducacaoRepository) {

    fun criarEducacao(educacaoRequestDTO: EducacaoRequestDTO): EducacaoDTO {
        val educacao = educacaoRepository.save(
            Educacao(
                nome = educacaoRequestDTO.nome,
                descricao = educacaoRequestDTO.descricao,
                nivel = educacaoRequestDTO.nivel,
                modalidade = educacaoRequestDTO.modalidade,
                cargaHoraria = educacaoRequestDTO.cargaHoraria,
                precoEducacao = educacaoRequestDTO.precoEducacao,

                ativo = educacaoRequestDTO.ativo
                )
        )
        return educacao.toDTO()
    }

    fun buscarEducacaoPorId(idEducacao: Int):EducacaoResponseDTO? {
        val educacao = educacaoRepository.findById(idEducacao).orElse(null)?: return null
        return educacao.toResponseDTO()
    }

    fun listarTodosEducativos(): List<EducacaoResponseDTO> {
        val educacao = educacaoRepository.findAll()
        return educacao.stream().map { educacao ->  educacao.toResponseDTO() }.collect(Collectors.toList())
    }

    fun atualizarEducacao(id: Int, educacaoRequestDTO: EducacaoRequestDTO): EducacaoResponseDTO? {
        val educacao = educacaoRepository.findById(id).orElse(null) ?: return null

        educacao.nome = educacaoRequestDTO.nome
        educacao.descricao = educacaoRequestDTO.descricao
        educacao.nivel = educacaoRequestDTO.nivel
        educacao.modalidade = educacaoRequestDTO.modalidade
        educacao.cargaHoraria = educacaoRequestDTO.cargaHoraria
        educacao.precoEducacao = educacaoRequestDTO.precoEducacao

        val updatedEducacao = educacaoRepository.save(educacao)
        return updatedEducacao.toResponseDTO()
    }

        fun desativarEducacao(id: Int): Boolean {
            val educacaoOptional = educacaoRepository.findById(id)
            if (educacaoOptional.isPresent) {
                val educacao = educacaoOptional.get()
                educacao.ativo = false
                educacaoRepository.save(educacao)
                return true
            }
            return false
        }


    private fun Educacao.toDTO() = EducacaoDTO(
        idEducacao = this.idEducacao,
        nome = this.nome,
        descricao = this.descricao,
        nivel = this.nivel,
        modalidade = this.modalidade,
        cargaHoraria = this.cargaHoraria,
        precoEducacao = this.precoEducacao,
        ativo = this.ativo
    )

    private fun Educacao.toResponseDTO() = EducacaoResponseDTO(
        idEducacao = this.idEducacao,
        nome = this.nome,
        descricao = this.descricao,
        nivel = this.nivel,
        modalidade = this.modalidade,
        cargaHoraria = this.cargaHoraria,
        precoEducacao = this.precoEducacao,
        ativo = this.ativo
    ) }

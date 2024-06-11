package sptech.projetojpa1.service

import org.hibernate.boot.model.naming.ImplicitNamingStrategyLegacyHbmImpl
import org.springframework.stereotype.Service
import sptech.projetojpa1.dominio.Educacao
import sptech.projetojpa1.dto.educacao.EducacaoDTO
import sptech.projetojpa1.dto.educacao.EducacaoPutDTO
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
                descricao = educacaoRequestDTO.descricao!!,
                nivel = educacaoRequestDTO.nivel,
                modalidade = educacaoRequestDTO.modalidade,
                cargaHoraria = educacaoRequestDTO.cargaHoraria,
                precoEducacao = educacaoRequestDTO.precoEducacao,

                ativo = educacaoRequestDTO.ativo
                )
        )
        return educacao.toDTO()
    }

    fun listarTodosEducativos(): List<EducacaoResponseDTO> {
        val educacao = educacaoRepository.findAll()
        return educacao.stream().map { educacao ->  educacao.toResponseDTO() }.collect(Collectors.toList())
    }

    fun listarEducativosAtivos(ativo:Boolean):List<Educacao> {
        return educacaoRepository.findByAtivo(ativo).map {
                educacao ->
            Educacao(
                idEducacao = educacao.idEducacao,
                nome = educacao.nome,
                descricao = educacao.descricao,
                nivel = educacao.nivel,
                modalidade = educacao.modalidade,
                cargaHoraria = educacao.cargaHoraria,
                precoEducacao = educacao.precoEducacao,
                ativo = educacao.ativo
                )
        }
    }

    fun buscarEducacaoPorId(idEducacao: Int):EducacaoResponseDTO? {
        val educacao = educacaoRepository.findById(idEducacao).orElse(null)?: return null
        return educacao.toResponseDTO()
    }

    fun atualizarEducacao(id: Int, educacaoRequestDTO: EducacaoPutDTO): EducacaoResponseDTO? {
        val educacao = educacaoRepository.findById(id).orElse(null) ?: return null

        if (educacaoRequestDTO.nome != null){
            educacao.nome = educacaoRequestDTO.nome
        }
        if (educacaoRequestDTO.descricao != null){
            educacao.descricao = educacaoRequestDTO.descricao!!
        }
        if (educacaoRequestDTO.nivel != null){
            educacao.nivel = educacaoRequestDTO.nivel!!
        }
        if (educacaoRequestDTO.modalidade != null){
            educacao.modalidade = educacaoRequestDTO.modalidade
        }
        if (educacaoRequestDTO.cargaHoraria != null){
            educacao.cargaHoraria = educacaoRequestDTO.cargaHoraria!!
        }
        if (educacaoRequestDTO.precoEducacao != null){
            educacao.precoEducacao = educacaoRequestDTO.precoEducacao!!
        }

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

    fun alterarStatusEducacao(id:Int, novoStatus:Boolean):EducacaoRequestDTO? {
        val educacaoOptional = educacaoRepository.findById(id)
        if (educacaoOptional.isPresent){
            val educacao = educacaoOptional.get()
            educacao.ativo = novoStatus
            val educacaoSalva = educacaoRepository.save(educacao)
            return EducacaoRequestDTO(
                idEducacao = educacaoSalva.idEducacao,
                nome =  educacaoSalva.nome,
                descricao = educacaoSalva.descricao,
                nivel = educacaoSalva.nivel,
                modalidade = educacaoSalva.modalidade,
                cargaHoraria = educacaoSalva.cargaHoraria,
                precoEducacao = educacaoSalva.precoEducacao,
                ativo = educacaoSalva.ativo
            )
        }
        return null
    }

    fun excluirEducacao(id:Int) {
        if (!educacaoRepository.existsById(id))
    {
        throw IllegalArgumentException("Educativo não encontrado!")
    }
    educacaoRepository.deleteById(id)
    }

    private fun Educacao.toDTO() = EducacaoDTO(
        idEducacao = this.idEducacao,
        nome = this.nome!!,
        descricao = this.descricao,
        nivel = this.nivel,
        modalidade = this.modalidade!!,
        cargaHoraria = this.cargaHoraria,
        precoEducacao = this.precoEducacao,
        ativo = this.ativo
    )

    private fun Educacao.toResponseDTO() = EducacaoResponseDTO(
        idEducacao = this.idEducacao,
        nome = this.nome!!,
        descricao = this.descricao,
        nivel = this.nivel,
        modalidade = this.modalidade!!,
        cargaHoraria = this.cargaHoraria,
        precoEducacao = this.precoEducacao,
        ativo = this.ativo
    ) }

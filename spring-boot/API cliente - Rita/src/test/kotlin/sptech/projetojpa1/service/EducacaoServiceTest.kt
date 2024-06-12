package sptech.projetojpa1.service

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.Mockito.*
import org.mockito.junit.jupiter.MockitoExtension
import sptech.projetojpa1.dominio.Educacao
import sptech.projetojpa1.dto.educacao.EducacaoPutDTO
import sptech.projetojpa1.dto.educacao.EducacaoRequestDTO
import sptech.projetojpa1.repository.EducacaoRepository
import java.util.*

@ExtendWith(MockitoExtension::class)
class EducacaoServiceTest {
    @Mock
    lateinit var educacaoRepository: EducacaoRepository

    @InjectMocks
    lateinit var educacaoService: EducacaoService

    @Test
    @DisplayName("Teste de criação de educação com dados válidos")
    fun `test criarEducacao com dados válidos`() {
        // Dados fictícios que atendem às validações
        val requestDTO = EducacaoRequestDTO(
            nome = "Maquiagem Avançada",
            descricao = "Curso intensivo de maquiagem para maquiadores experientes.",
            nivel = "Avançado",
            modalidade = "Presencial",
            cargaHoraria = "20:00",
            precoEducacao = 1500.00,
            ativo = true
        )

        val educacao = Educacao(
            nome = requestDTO.nome,
            descricao = requestDTO.descricao!!,
            nivel = requestDTO.nivel,
            modalidade = requestDTO.modalidade!!,
            cargaHoraria = requestDTO.cargaHoraria,
            precoEducacao = requestDTO.precoEducacao,
            ativo = requestDTO.ativo
        )

        val savedEducacao = educacao.copy(idEducacao = 1)

        `when`(educacaoRepository.save(any(Educacao::class.java))).thenReturn(savedEducacao)

        val result = educacaoService.criarEducacao(requestDTO)

        assertNotNull(result)
        assertEquals(1, result.idEducacao)
        assertEquals("Maquiagem Avançada", result.nome)
        assertEquals("Curso intensivo de maquiagem para maquiadores experientes.", result.descricao)
        assertEquals("Avançado", result.nivel)
        assertEquals("Presencial", result.modalidade)
        assertEquals("20:00", result.cargaHoraria)
        assertEquals(1500.00, result.precoEducacao)
        assertTrue(result.ativo)
    }

    // Outros testes para métodos como listarTodosEducativos, listarEducativosAtivos, buscarEducacaoPorId, etc.
    // Utilizando dados fictícios na área da beleza

    @Test
    @DisplayName("Teste de listagem de todos os programas educativos")
    fun `test listarTodosEducativos`() {
        val educacao1 = Educacao(1, "Corte de Cabelo", "Descrição 1", "Básico", "Presencial", "10:00", 500.00, true)
        val educacao2 = Educacao(2, "Manicure e Pedicure", "Descrição 2", "Intermediário", "Online", "15:00", 750.00, true)

        `when`(educacaoRepository.findAll()).thenReturn(listOf(educacao1, educacao2))

        val result = educacaoService.listarTodosEducativos()

        assertNotNull(result)
        assertEquals(2, result.size)
        assertEquals("Corte de Cabelo", result[0].nome)
        assertEquals("Manicure e Pedicure", result[1].nome)
    }

    @Test
    @DisplayName("Teste de listagem de programas educativos ativos")
    fun `test listarEducativosAtivos`() {
        val educacao1 = Educacao(1, "Maquiagem Básica", "Descrição 1", "Básico", "Presencial", "10:00", 500.00, true)
        val educacao2 = Educacao(2, "Maquiagem Artística", "Descrição 2", "Avançado", "Online", "15:00", 1000.00, true)

        `when`(educacaoRepository.findByAtivo(true)).thenReturn(listOf(educacao1, educacao2))

        val result = educacaoService.listarEducativosAtivos(true)

        assertNotNull(result)
        assertEquals(2, result.size)
        assertEquals("Maquiagem Básica", result[0].nome)
        assertEquals("Maquiagem Artística", result[1].nome)
    }

    @Test
    @DisplayName("Teste de busca de programa educativo por ID")
    fun `test buscarEducacaoPorId`() {
        val educacao = Educacao(1, "Design de Sobrancelhas", "Descrição 1", "Intermediário", "Presencial", "10:00", 600.00, true)

        `when`(educacaoRepository.findById(1)).thenReturn(Optional.of(educacao))

        val result = educacaoService.buscarEducacaoPorId(1)

        assertNotNull(result)
        assertEquals(1, result?.idEducacao)
        assertEquals("Design de Sobrancelhas", result?.nome)
        assertEquals("Descrição 1", result?.descricao)
    }

    @Test
    @DisplayName("Teste de atualização de programa educativo")
    fun `test atualizarEducacao`() {
        val educacao = Educacao(1, "Curso de Unhas", "Descrição 1", "Básico", "Presencial", "10:00", 400.00, true)
        val updateDTO = EducacaoPutDTO(
            nome = "Curso de Unhas Atualizado",
            descricao = "Descrição Atualizada",
            nivel = "Intermediário",
            modalidade = "Online",
            cargaHoraria = "12:00",
            precoEducacao = 800.00
        )

        `when`(educacaoRepository.findById(1)).thenReturn(Optional.of(educacao))
        `when`(educacaoRepository.save(any(Educacao::class.java))).thenReturn(educacao.copy(
            nome = updateDTO.nome,
            descricao = updateDTO.descricao!!,
            nivel = updateDTO.nivel!!,
            modalidade = updateDTO.modalidade!!,
            cargaHoraria = updateDTO.cargaHoraria!!,
            precoEducacao = updateDTO.precoEducacao!!
        ))

        val result = educacaoService.atualizarEducacao(1, updateDTO)

        assertNotNull(result)
        assertEquals(1, result?.idEducacao)
        assertEquals("Curso de Unhas Atualizado", result?.nome)
        assertEquals("Descrição Atualizada", result?.descricao)
        assertEquals("Intermediário", result?.nivel)
        assertEquals("Online", result?.modalidade)
        assertEquals("12:00", result?.cargaHoraria)
        assertEquals(800.00, result?.precoEducacao)
    }

    @Test
    @DisplayName("Teste de desativação de programa educativo")
    fun `test desativarEducacao`() {
        val educacao = Educacao(1, "Tratamento Capilar", "Descrição 1", "Básico", "Presencial", "10:00", 700.00, true)

        `when`(educacaoRepository.findById(1)).thenReturn(Optional.of(educacao))

        val result = educacaoService.desativarEducacao(1)

        assertTrue(result)
        verify(educacaoRepository, times(1)).save(educacao.copy(ativo = false))
    }

    @Test
    @DisplayName("Teste de alteração de status de programa educativo")
    fun `test alterarStatusEducacao`() {
        val educacao = Educacao(1, "Curso de Estética Facial", "Descrição 1", "Avançado", "Presencial", "10:00", 1200.00, true)

        `when`(educacaoRepository.findById(1)).thenReturn(Optional.of(educacao))
        `when`(educacaoRepository.save(any(Educacao::class.java))).thenReturn(educacao.copy(ativo = false))

        val result = educacaoService.alterarStatusEducacao(1, false)

        assertNotNull(result)
        assertEquals(1, result?.idEducacao)
        assertEquals("Curso de Estética Facial", result?.nome)
        assertFalse(result?.ativo ?: true)
    }

    @Test
    @DisplayName("Teste de exclusão de programa educativo")
    fun `test excluirEducacao`() {
        `when`(educacaoRepository.existsById(1)).thenReturn(true)

        educacaoService.excluirEducacao(1)

        verify(educacaoRepository, times(1)).deleteById(1)
    }
}

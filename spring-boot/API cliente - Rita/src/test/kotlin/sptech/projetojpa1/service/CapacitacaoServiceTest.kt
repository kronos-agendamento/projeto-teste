package sptech.projetojpa1.service

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.Mockito.*
import org.mockito.junit.jupiter.MockitoExtension
import sptech.projetojpa1.dominio.Capacitacao
import sptech.projetojpa1.dto.capacitacao.CapacitacaoPutDTO
import sptech.projetojpa1.dto.capacitacao.CapacitacaoRequestDTO
import sptech.projetojpa1.repository.CapacitacaoRepository
import java.util.*

@ExtendWith(MockitoExtension::class)
class CapacitacaoServiceTest {
    @Mock
    lateinit var capacitacaoRepository: CapacitacaoRepository

    @InjectMocks
    lateinit var capacitacaoService: CapacitacaoService

    @Test
    @DisplayName("Teste de criação de capacitação com dados válidos")
    fun `test criarCapacitacao com dados válidos`() {
        // Dados fictícios que atendem às validações
        val requestDTO = CapacitacaoRequestDTO(
            nome = "Maquiagem Avançada",
            descricao = "Curso intensivo de maquiagem para maquiadores experientes.",
            nivel = "Avançado",
            modalidade = "Presencial",
            cargaHoraria = "20:00",
            precoCapacitacao = 1500.00,
            ativo = true
        )

        val capacitacao = Capacitacao(
            nome = requestDTO.nome,
            descricao = requestDTO.descricao!!,
            nivel = requestDTO.nivel,
            modalidade = requestDTO.modalidade!!,
            cargaHoraria = requestDTO.cargaHoraria,
            precoCapacitacao = requestDTO.precoCapacitacao,
            ativo = requestDTO.ativo
        )

        val savedCapacitacao = capacitacao.copy(idCapacitacao = 1)

        `when`(capacitacaoRepository.save(any(Capacitacao::class.java))).thenReturn(savedCapacitacao)

        val result = capacitacaoService.criarCapacitacao(requestDTO)

        assertNotNull(result)
        assertEquals(1, result.idCapacitacao)
        assertEquals("Maquiagem Avançada", result.nome)
        assertEquals("Curso intensivo de maquiagem para maquiadores experientes.", result.descricao)
        assertEquals("Avançado", result.nivel)
        assertEquals("Presencial", result.modalidade)
        assertEquals("20:00", result.cargaHoraria)
        assertEquals(1500.00, result.precoCapacitacao)
        assertTrue(result.ativo)
    }

    // Outros testes para métodos como listarTodasCapacitacoes, listarCapacitacoesAtivas, buscarCapacitacaoPorId, etc.
    // Utilizando dados fictícios na área da beleza

    @Test
    @DisplayName("Teste de listagem de todas as capacitações")
    fun `test listarTodasCapacitacoes`() {
        val capacitacao1 = Capacitacao(1, "Corte de Cabelo", "Descrição 1", "Básico", "Presencial", "10:00", 500.00, true)
        val capacitacao2 = Capacitacao(2, "Manicure e Pedicure", "Descrição 2", "Intermediário", "Online", "15:00", 750.00, true)

        `when`(capacitacaoRepository.findAll()).thenReturn(listOf(capacitacao1, capacitacao2))

        val result = capacitacaoService.listarTodasCapacitacoes()

        assertNotNull(result)
        assertEquals(2, result.size)
        assertEquals("Corte de Cabelo", result[0].nome)
        assertEquals("Manicure e Pedicure", result[1].nome)
    }

    @Test
    @DisplayName("Teste de listagem de capacitações ativas")
    fun `test listarCapacitacoesAtivas`() {
        val capacitacao1 = Capacitacao(1, "Maquiagem Básica", "Descrição 1", "Básico", "Presencial", "10:00", 500.00, true)
        val capacitacao2 = Capacitacao(2, "Maquiagem Artística", "Descrição 2", "Avançado", "Online", "15:00", 1000.00, true)

        `when`(capacitacaoRepository.findByAtivo(true)).thenReturn(listOf(capacitacao1, capacitacao2))

        val result = capacitacaoService.listarCapacitacoesAtivas(true)

        assertNotNull(result)
        assertEquals(2, result.size)
        assertEquals("Maquiagem Básica", result[0].nome)
        assertEquals("Maquiagem Artística", result[1].nome)
    }

    @Test
    @DisplayName("Teste de busca de capacitação por ID")
    fun `test buscarCapacitacaoPorId`() {
        val capacitacao = Capacitacao(1, "Design de Sobrancelhas", "Descrição 1", "Intermediário", "Presencial", "10:00", 600.00, true)

        `when`(capacitacaoRepository.findById(1)).thenReturn(Optional.of(capacitacao))

        val result = capacitacaoService.buscarCapacitacaoPorId(1)

        assertNotNull(result)
        assertEquals(1, result?.idCapacitacao)
        assertEquals("Design de Sobrancelhas", result?.nome)
        assertEquals("Descrição 1", result?.descricao)
    }

    @Test
    @DisplayName("Teste de atualização de capacitação")
    fun `test atualizarCapacitacao`() {
        val capacitacao = Capacitacao(1, "Curso de Unhas", "Descrição 1", "Básico", "Presencial", "10:00", 400.00, true)
        val updateDTO = CapacitacaoPutDTO(
            nome = "Curso de Unhas Atualizado",
            descricao = "Descrição Atualizada",
            nivel = "Intermediário",
            modalidade = "Online",
            cargaHoraria = "12:00",
            precoCapacitacao = 800.00
        )

        `when`(capacitacaoRepository.findById(1)).thenReturn(Optional.of(capacitacao))
        `when`(capacitacaoRepository.save(any(Capacitacao::class.java))).thenReturn(capacitacao.copy(
            nome = updateDTO.nome,
            descricao = updateDTO.descricao!!,
            nivel = updateDTO.nivel!!,
            modalidade = updateDTO.modalidade!!,
            cargaHoraria = updateDTO.cargaHoraria!!,
            precoCapacitacao = updateDTO.precoCapacitacao!!
        ))

        val result = capacitacaoService.atualizarCapacitacao(1, updateDTO)

        assertNotNull(result)
        assertEquals(1, result?.idCapacitacao)
        assertEquals("Curso de Unhas Atualizado", result?.nome)
        assertEquals("Descrição Atualizada", result?.descricao)
        assertEquals("Intermediário", result?.nivel)
        assertEquals("Online", result?.modalidade)
        assertEquals("12:00", result?.cargaHoraria)
        assertEquals(800.00, result?.precoCapacitacao)
    }

    @Test
    @DisplayName("Teste de desativação de capacitação")
    fun `test desativarCapacitacao`() {
        val capacitacao = Capacitacao(1, "Tratamento Capilar", "Descrição 1", "Básico", "Presencial", "10:00", 700.00, true)

        `when`(capacitacaoRepository.findById(1)).thenReturn(Optional.of(capacitacao))

        val result = capacitacaoService.desativarCapacitacao(1)

        assertTrue(result)
        verify(capacitacaoRepository, times(1)).save(capacitacao.copy(ativo = false))
    }

    @Test
    @DisplayName("Teste de alteração de status de capacitação")
    fun `test alterarStatusCapacitacao`() {
        val capacitacao = Capacitacao(1, "Curso de Estética Facial", "Descrição 1", "Avançado", "Presencial", "10:00", 1200.00, true)

        `when`(capacitacaoRepository.findById(1)).thenReturn(Optional.of(capacitacao))
        `when`(capacitacaoRepository.save(any(Capacitacao::class.java))).thenReturn(capacitacao.copy(ativo = false))

        val result = capacitacaoService.alterarStatusCapacitacao(1, false)

        assertNotNull(result)
        assertEquals(1, result?.idCapacitacao)
        assertEquals("Curso de Estética Facial", result?.nome)
        assertFalse(result?.ativo ?: true)
    }

    @Test
    @DisplayName("Teste de exclusão de capacitação")
    fun `test excluirCapacitacao`() {
        `when`(capacitacaoRepository.existsById(1)).thenReturn(true)

        capacitacaoService.excluirCapacitacao(1)

        verify(capacitacaoRepository, times(1)).deleteById(1)
    }
}

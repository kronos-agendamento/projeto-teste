package sptech.projetojpa1.service

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.Mockito.`when`
import org.mockito.Mockito.any
import org.mockito.MockitoAnnotations
import sptech.projetojpa1.dominio.Pergunta
import sptech.projetojpa1.dto.pergunta.PerguntaRequest
import sptech.projetojpa1.repository.PerguntaRepository

class PerguntaServiceTest {

    @Mock
    lateinit var perguntaRepository: PerguntaRepository

    @InjectMocks
    lateinit var perguntaService: PerguntaService

    @BeforeEach
    fun setUp() {
        MockitoAnnotations.openMocks(this)
    }

    @Test
    fun `Teste cadastrarPergunta`() {
        val perguntaRequest = PerguntaRequest(1, "Descrição da pergunta", "Tipo da pergunta", false)
        val pergunta = Pergunta(1, "Descrição da pergunta", "Tipo da pergunta", false)

        `when`(perguntaRepository.save(any())).thenReturn(pergunta)

        val result = perguntaService.cadastrarPergunta(perguntaRequest)

        assertEquals(perguntaRequest, result)
    }

    @Test
    fun `Teste listarTodasPerguntas`() {
        val pergunta = Pergunta(1, "Descrição da pergunta", "Tipo da pergunta", false)
        val perguntaList = listOf(pergunta)

        `when`(perguntaRepository.findAll()).thenReturn(perguntaList)

        val result = perguntaService.listarTodasPerguntas()

        assertEquals(1, result.size)
        assertEquals(pergunta.descricao, result[0].descricao)
    }

    @Test
    fun `Teste buscarPorDescricao`() {
        val descricao = "Descrição da pergunta"
        val pergunta = Pergunta(1, descricao, "Tipo da pergunta", false)
        val perguntaList = listOf(pergunta)

        `when`(perguntaRepository.findByDescricaoContainsIgnoreCase(descricao)).thenReturn(perguntaList)

        val result = perguntaService.buscarPorDescricao(descricao)

        assertEquals(1, result.size)
        assertEquals(descricao, result[0].descricao)
    }

    @Test
    fun `Teste listarPerguntasAtivas`() {
        val pergunta = Pergunta(1, "Descrição da pergunta", "Tipo da pergunta", true)
        val perguntaList = listOf(pergunta)

        `when`(perguntaRepository.findByStatus(true)).thenReturn(perguntaList)

        val result = perguntaService.listarPerguntasAtivas(true)

        assertEquals(1, result.size)
        assertEquals(pergunta.tipo, result[0].tipo)
    }

    @Test
    fun `Teste alterarStatusPergunta`() {
        val perguntaId = 1
        val novoStatus = true
        val pergunta = Pergunta(1, "Descrição da pergunta", "Tipo da pergunta", false)

        `when`(perguntaRepository.findById(perguntaId)).thenReturn(java.util.Optional.of(pergunta))
        `when`(perguntaRepository.save(pergunta)).thenReturn(pergunta)

        val result = perguntaService.alterarStatusPergunta(perguntaId, novoStatus)

        assertEquals(novoStatus, result?.status)
    }

    @Test
    fun `Teste editarDescricaoPergunta`() {
        val perguntaId = 1
        val novaDescricao = "Nova descrição da pergunta"
        val pergunta = Pergunta(1, "Descrição da pergunta", "Tipo da pergunta", false)

        `when`(perguntaRepository.findById(perguntaId)).thenReturn(java.util.Optional.of(pergunta))
        `when`(perguntaRepository.save(pergunta)).thenReturn(pergunta)

        val result = perguntaService.editarDescricaoPergunta(perguntaId, novaDescricao)

        assertEquals(novaDescricao, result?.descricao)
    }
}

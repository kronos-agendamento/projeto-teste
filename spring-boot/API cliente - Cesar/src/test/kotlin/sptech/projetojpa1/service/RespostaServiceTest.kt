package sptech.projetojpa1.service

import io.mockk.*
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.mockito.Mockito.`when`
import org.springframework.http.ResponseEntity
import sptech.projetojpa1.dominio.*
import sptech.projetojpa1.dto.resposta.RespostaDTO
import sptech.projetojpa1.dto.resposta.RespostaPersonalidade
import sptech.projetojpa1.dto.resposta.RespostaRequestDTO
import sptech.projetojpa1.repository.*
import java.time.LocalDate
import java.time.LocalDateTime
import java.util.*
import javax.management.Query.times

class RespostaServiceTest {

    private lateinit var respostaService: RespostaService
    private val respostaRepository: RespostaRepository = mockk()
    private val perguntaRepository: PerguntaRepository = mockk()
    private val fichaAnamneseRepository: FichaAnamneseRepository = mockk()
    private val usuarioRepository: UsuarioRepository = mockk()
    private val personalidadeRepository: PersonalidadeRepository = mockk()

    // private val respostaService: RespostaService = RespostaService(personalidadeRepository, usuarioRepository)

    @BeforeEach
    fun setUp() {
        respostaService =
            RespostaService(respostaRepository, perguntaRepository, fichaAnamneseRepository, usuarioRepository, personalidadeRepository)
    }

    @Test
    @DisplayName("Teste para verificar se a resposta é cadastrada corretamente com dados válidos")
    fun `test cadastrarResposta with valid data`() {
        // Arrange
        val request = RespostaRequestDTO(
            resposta = "Sim",
            perguntaId = 1,
            fichaId = 1,
            usuarioId = 1
        )

        val pergunta = Pergunta(codigoPergunta = 1, descricao = "Pergunta 1", tipo = "Texto")
        val ficha = FichaAnamnese(codigoFicha = 1, dataPreenchimento = LocalDateTime.now())
        val usuario = Usuario(
            codigo = 1,
            nome = "Teste",
            email = "teste@example.com",
            senha = "senha123",
            instagram = "testInstagram",
            cpf = "12345678901",
            telefone = 1234567890,
            telefoneEmergencial = 1234567890,
            dataNasc = LocalDate.of(2000, 1, 1),
            genero = "Masculino",
            indicacao = "Indicação",
            foto = null,
            status = true,
            nivelAcesso = null,
            endereco = null,
            empresa = null,
            fichaAnamnese = null
        )

        val resposta = Resposta(
            codigoRespostaFichaUsuario = 1,
            resposta = "Sim",
            pergunta = pergunta,
            ficha = ficha,
            usuario = usuario
        )

        every { perguntaRepository.findById(request.perguntaId) } returns Optional.of(pergunta)
        every { fichaAnamneseRepository.findById(request.fichaId) } returns Optional.of(ficha)
        every { usuarioRepository.findById(request.usuarioId) } returns Optional.of(usuario)
        every { respostaRepository.save(any()) } returns resposta

        // Act
        val response = respostaService.cadastrarResposta(request)

        // Assert
        assertNotNull(response)
        assertEquals("Sim", response.resposta)
        assertEquals("Pergunta 1", response.perguntaDescricao)
        assertEquals("Texto", response.perguntaTipo)
        assertEquals("Teste", response.usuarioNome)
        assertEquals("12345678901", response.usuarioCpf)
        assertEquals(ficha.dataPreenchimento.toString(), response.fichaDataPreenchimento)

        verify { respostaRepository.save(any()) }
    }

    @Test
    @DisplayName("Teste para verificar se todas as respostas são listadas corretamente")
    fun `test listarTodasRespostas`() {
        // Arrange
        val pergunta = Pergunta(codigoPergunta = 1, descricao = "Pergunta 1", tipo = "Texto")
        val ficha = FichaAnamnese(codigoFicha = 1, dataPreenchimento = LocalDateTime.now())
        val usuario = Usuario(
            codigo = 1,
            nome = "Teste",
            email = "teste@example.com",
            senha = "senha123",
            instagram = "testInstagram",
            cpf = "12345678901",
            telefone = 1234567890,
            telefoneEmergencial = 1234567890,
            dataNasc = LocalDate.of(2000, 1, 1),
            genero = "Masculino",
            indicacao = "Indicação",
            foto = null,
            status = true,
            nivelAcesso = null,
            endereco = null,
            empresa = null,
            fichaAnamnese = null
        )

        val resposta = Resposta(
            codigoRespostaFichaUsuario = 1,
            resposta = "Sim",
            pergunta = pergunta,
            ficha = ficha,
            usuario = usuario
        )

        every { respostaRepository.findAll() } returns listOf(resposta)

        // Act
        val respostas = respostaService.listarTodasRespostas()

        // Assert
        assertNotNull(respostas)
        assertTrue(respostas.isNotEmpty())
        assertEquals(1, respostas.size)
        assertEquals("Sim", respostas[0].resposta)
    }

    @Test
    @DisplayName("Teste para verificar se as respostas são filtradas corretamente por CPF")
    fun `test filtrarPorCpf`() {
        // Arrange
        val cpf = "12345678901"
        val pergunta = Pergunta(codigoPergunta = 1, descricao = "Pergunta 1", tipo = "Texto")
        val ficha = FichaAnamnese(codigoFicha = 1, dataPreenchimento = LocalDateTime.now())
        val usuario = Usuario(
            codigo = 1,
            nome = "Teste",
            email = "teste@example.com",
            senha = "senha123",
            instagram = "testInstagram",
            cpf = cpf,
            telefone = 1234567890,
            telefoneEmergencial = 1234567890,
            dataNasc = LocalDate.of(2000, 1, 1),
            genero = "Masculino",
            indicacao = "Indicação",
            foto = null,
            status = true,
            nivelAcesso = null,
            endereco = null,
            empresa = null,
            fichaAnamnese = null
        )

        val resposta = Resposta(
            codigoRespostaFichaUsuario = 1,
            resposta = "Sim",
            pergunta = pergunta,
            ficha = ficha,
            usuario = usuario
        )

        every { respostaRepository.findByUsuarioCpf(cpf) } returns listOf(resposta)

        // Act
        val respostas = respostaService.filtrarPorCpf(cpf)

        // Assert
        assertNotNull(respostas)
        assertTrue(respostas.isNotEmpty())
        assertEquals(1, respostas.size)
        assertEquals("Sim", respostas[0].resposta)
        assertEquals(cpf, respostas[0].cpfUsuario)
    }

    @Test
    @DisplayName("Teste para verificar se as respostas são filtradas corretamente por CPF")

    fun `test excluirResposta with valid id`() {
        // Arrange
        val id = 1
        val pergunta = Pergunta(codigoPergunta = 1, descricao = "Pergunta 1", tipo = "Texto")
        val ficha = FichaAnamnese(codigoFicha = 1, dataPreenchimento = LocalDateTime.now())
        val usuario = Usuario(
            codigo = 1,
            nome = "Teste",
            email = "teste@example.com",
            senha = "senha123",
            instagram = "testInstagram",
            cpf = "12345678901",
            telefone = 1234567890,
            telefoneEmergencial = 1234567890,
            dataNasc = LocalDate.of(2000, 1, 1),
            genero = "Masculino",
            indicacao = "Indicação",
            foto = null,
            status = true,
            nivelAcesso = null,
            endereco = null,
            empresa = null,
            fichaAnamnese = null
        )

        val resposta = Resposta(
            codigoRespostaFichaUsuario = id,
            resposta = "Sim",
            pergunta = pergunta,
            ficha = ficha,
            usuario = usuario
        )

        every { respostaRepository.findById(id) } returns Optional.of(resposta)
        every { respostaRepository.deleteById(id) } just runs

        // Act
        val result = respostaService.excluirResposta(id)

        // Assert
        assertTrue(result)
        verify { respostaRepository.deleteById(id) }
    }

    @Test
    @DisplayName("Teste para verificar se a resposta é excluída corretamente com um ID válido")
    fun `test excluirResposta with invalid id`() {
        // Arrange
        val id = 1

        every { respostaRepository.findById(id) } returns Optional.empty()

        // Act
        val result = respostaService.excluirResposta(id)

        // Assert
        assertFalse(result)
        verify(exactly = 0) { respostaRepository.deleteById(id) }
    }


    // Teste do post do César
    @Test
    @DisplayName("Teste para verificar se a personalidade está correta")
    fun `Teste registrarPersonalidade`() {
        // Dados de entrada do teste
        val respostasDTO = listOf(
            RespostaDTO(resposta = "Cílios", perguntaId = 1),
            RespostaDTO(resposta = "Volume Fio a Fio", perguntaId = 2),
            RespostaDTO(resposta = "Ler livros", perguntaId = 3),
            RespostaDTO(resposta = "Artistica", perguntaId = 4)
        )
        val respostaPersonalidade = RespostaPersonalidade(usuarioId = 1, respostas = respostasDTO)

        // Mock do comportamento do repository
        every { personalidadeRepository.findByPersonalidade("Paciente e Criativa") } returns 1
        every { usuarioRepository.atualizarPersonalidadeDoUsuario(1, 1) } returns Unit

        // Chamar o serviço com os dados de teste
        val responseEntity: ResponseEntity<String> = respostaService.filtrarPersonalidade(respostaPersonalidade)

        // Verificar se a personalidade foi determinada corretamente
        assertEquals(200, responseEntity.statusCodeValue)
        assertEquals("Paciente e Criativa", responseEntity.body)

        // Verificar se a personalidade foi atualizada no repositório do usuário
        verify(exactly = 1) { usuarioRepository.atualizarPersonalidadeDoUsuario(1, 1) }
    }


    @Test
    @DisplayName("Teste para verificar se a personalidade é deletada corretamente")
    fun `Teste deletarPersonalidade`() {
        // Dados de entrada do teste
        val respostasDTO = listOf(
            RespostaDTO(resposta = "Cílios", perguntaId = 1),
            RespostaDTO(resposta = "Volume Fio a Fio", perguntaId = 2),
            RespostaDTO(resposta = "Ler livros", perguntaId = 3),
            RespostaDTO(resposta = "Artistica", perguntaId = 4)
        )
        val respostaPersonalidade = RespostaPersonalidade(usuarioId = 1, respostas = respostasDTO)

        // Mock do comportamento do repository
        every { usuarioRepository.deletarPersonalidadeDoUsuario(1) } returns Unit

        // Chamar o serviço com os dados de teste
        val responseEntity: ResponseEntity<String> = respostaService.deletarPersonalidade(respostaPersonalidade)

        // Verificar se a resposta está correta
        assertEquals(200, responseEntity.statusCodeValue)
        assertEquals("Deletado com sucesso!", responseEntity.body)

        // Verificar se a personalidade foi deletada no repositório do usuário
        verify(exactly = 1) { usuarioRepository.deletarPersonalidadeDoUsuario(1) }
    }
    // Post Personalidade - César
    // @PostMapping("/verificar-personalidade")
    // fun regsitrarPersonalidade(@RequestBody respostasChegando: RespostaPersonalidade): String{
    //    val resultado = respostaService.filtrarPersonalidade(respostasChegando)
    //    return resultado
    //}
}

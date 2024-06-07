package sptech.projetojpa1.service

import io.mockk.every
import io.mockk.mockk
import io.mockk.slot
import io.mockk.verify
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import sptech.projetojpa1.dominio.NivelAcesso
import sptech.projetojpa1.dominio.Usuario
import sptech.projetojpa1.dto.usuario.UsuarioAtualizacaoRequest
import sptech.projetojpa1.dto.usuario.UsuarioLoginRequest
import sptech.projetojpa1.dto.usuario.UsuarioRequest
import sptech.projetojpa1.repository.*
import java.time.LocalDate
import java.util.*

class UsuarioServiceTest {

    private lateinit var usuarioRepository: UsuarioRepository
    private lateinit var nivelAcessoRepository: NivelAcessoRepository
    private lateinit var enderecoRepository: EnderecoRepository
    private lateinit var empresaRepository: EmpresaRepository
    private lateinit var fichaAnamneseRepository: FichaAnamneseRepository
    private lateinit var respostaRepository: RespostaRepository
    private lateinit var usuarioService: UsuarioService

    @BeforeEach
    fun setUp() {
        usuarioRepository = mockk()
        nivelAcessoRepository = mockk()
        enderecoRepository = mockk()
        empresaRepository = mockk()
        fichaAnamneseRepository = mockk()
        respostaRepository = mockk()

        usuarioService = UsuarioService(
            usuarioRepository,
            nivelAcessoRepository,
            enderecoRepository,
            empresaRepository,
            fichaAnamneseRepository,
            respostaRepository
        )
    }

    @Test
    @DisplayName("Deve salvar um novo usuário e retornar o mesmo")
    fun `salvarUsuario deve salvar e retornar Usuario`() {
        val usuarioRequest = UsuarioRequest(
            codigo = 1,
            nome = "Teste",
            email = "teste@teste.com",
            senha = "1234",
            instagram = "testeInsta",
            cpf = "12345678900",
            telefone = 123456789,
            telefoneEmergencial = 987654321,
            dataNasc = LocalDate.of(1990, 1, 1),
            genero = "Masculino",
            indicacao = null,
            status = true,
            nivelAcessoId = null,
            enderecoId = null,
            empresaId = null,
            fichaAnamneseId = null
        )

        val usuario = Usuario(
            codigo = 1,
            nome = "Teste",
            email = "teste@teste.com",
            senha = "1234",
            instagram = "testeInsta",
            cpf = "12345678900",
            telefone = 123456789,
            telefoneEmergencial = 987654321,
            dataNasc = LocalDate.of(1990, 1, 1),
            genero = "Masculino",
            indicacao = null,
            foto = null,
            status = true,
            nivelAcesso = null,
            endereco = null,
            empresa = null,
            fichaAnamnese = null
        )

        every { usuarioRepository.save(any()) } returns usuario

        val result = usuarioService.salvarUsuario(usuarioRequest)

        assertNotNull(result)
        assertEquals(usuarioRequest.nome, result.nome)
        assertEquals(usuarioRequest.email, result.email)
        verify { usuarioRepository.save(any()) }
    }

    @Test
    @DisplayName("Deve realizar login e retornar mensagem de sucesso")
    fun `fazerLogin deve retornar mensagem de sucesso quando credenciais são corretas`() {
        val usuarioLoginRequest = UsuarioLoginRequest(
            email = "teste@teste.com",
            senha = "1234"
        )

        val usuario = Usuario(
            codigo = 1,
            nome = "Teste",
            email = "teste@teste.com",
            senha = "1234",
            instagram = "testeInsta",
            cpf = "12345678900",
            telefone = 123456789,
            telefoneEmergencial = 987654321,
            dataNasc = LocalDate.of(1990, 1, 1),
            genero = "Masculino",
            indicacao = null,
            foto = null,
            status = false,
            nivelAcesso = null,
            endereco = null,
            empresa = null,
            fichaAnamnese = null
        )

        every { usuarioRepository.findByEmailIgnoreCase(any()) } returns usuario
        every { usuarioRepository.save(any()) } returns usuario.copy(status = true)

        val result = usuarioService.fazerLogin(usuarioLoginRequest)

        assertEquals("Login do(a) Teste realizado com sucesso.", result)
        verify { usuarioRepository.save(any()) }
    }

    @Test
    @DisplayName("Deve realizar logoff e retornar mensagem de sucesso")
    fun `fazerLogoff deve retornar mensagem de sucesso quando CPF é válido`() {
        val usuario = Usuario(
            codigo = 1,
            nome = "Teste",
            email = "teste@teste.com",
            senha = "1234",
            instagram = "testeInsta",
            cpf = "12345678900",
            telefone = 123456789,
            telefoneEmergencial = 987654321,
            dataNasc = LocalDate.of(1990, 1, 1),
            genero = "Masculino",
            indicacao = null,
            foto = null,
            status = true,
            nivelAcesso = null,
            endereco = null,
            empresa = null,
            fichaAnamnese = null
        )

        every { usuarioRepository.findByCpf(any()) } returns usuario
        every { usuarioRepository.save(any()) } returns usuario.copy(status = false)

        val result = usuarioService.fazerLogoff("12345678900")

        assertEquals("Logoff do(a) Teste realizado com sucesso.", result)
        verify { usuarioRepository.save(any()) }
    }

    @Test
    @DisplayName("Deve atualizar usuário e retornar o usuário atualizado")
    fun `atualizarUsuario deve atualizar e retornar Usuario atualizado`() {
        val usuarioAtualizacaoRequest = UsuarioAtualizacaoRequest(
            nome = "Teste Atualizado",
            email = "atualizado@teste.com",
            senha = null,
            instagram = "atualizadoInsta",
            telefone = 123456789,
            telefoneEmergencial = 987654321,
            genero = "Masculino",
            indicacao = null,
            nivelAcessoId = null,
            enderecoId = null,
            empresaId = null,
            fichaAnamneseId = null
        )

        val usuario = Usuario(
            codigo = 1,
            nome = "Teste",
            email = "teste@teste.com",
            senha = "1234",
            instagram = "testeInsta",
            cpf = "12345678900",
            telefone = 123456789,
            telefoneEmergencial = 987654321,
            dataNasc = LocalDate.of(1990, 1, 1),
            genero = "Masculino",
            indicacao = null,
            foto = null,
            status = true,
            nivelAcesso = null,
            endereco = null,
            empresa = null,
            fichaAnamnese = null
        )

        every { usuarioRepository.findByCpf(any()) } returns usuario
        every { usuarioRepository.save(any()) } returns usuario.copy(
            nome = "Teste Atualizado",
            email = "atualizado@teste.com",
            instagram = "atualizadoInsta"
        )

        val result = usuarioService.atualizarUsuario("12345678900", usuarioAtualizacaoRequest)

        assertNotNull(result)
        assertEquals("Teste Atualizado", result?.nome)
        assertEquals("atualizado@teste.com", result?.email)
        verify { usuarioRepository.save(any()) }
    }

    @Test
    @DisplayName("Deve deletar um usuário e retornar true")
    fun `deletarUsuario deve deletar e retornar true quando CPF é válido`() {
        val usuario = Usuario(
            codigo = 1,
            nome = "Teste",
            email = "teste@teste.com",
            senha = "1234",
            instagram = "testeInsta",
            cpf = "12345678900",
            telefone = 123456789,
            telefoneEmergencial = 987654321,
            dataNasc = LocalDate.of(1990, 1, 1),
            genero = "Masculino",
            indicacao = null,
            foto = null,
            status = true,
            nivelAcesso = null,
            endereco = null,
            empresa = null,
            fichaAnamnese = null
        )

        every { usuarioRepository.findByCpf(any()) } returns usuario
        every { usuarioRepository.delete(any()) } returns Unit

        val result = usuarioService.deletarUsuario("12345678900")

        assertTrue(result)
        verify { usuarioRepository.delete(any()) }
    }

    @Test
    @DisplayName("Deve listar todos os usuários ativos")
    fun `listarUsuariosAtivos deve retornar lista de usuarios ativos`() {
        val usuarios = listOf(
            Usuario(
                codigo = 1,
                nome = "Teste",
                email = "teste@teste.com",
                senha = "1234",
                instagram = "testeInsta",
                cpf = "12345678900",
                telefone = 123456789,
                telefoneEmergencial = 987654321,
                dataNasc = LocalDate.of(1990, 1, 1),
                genero = "Masculino",
                indicacao = null,
                foto = null,
                status = true,
                nivelAcesso = null,
                endereco = null,
                empresa = null,
                fichaAnamnese = null
            )
        )

        every { usuarioRepository.findByStatusTrue() } returns usuarios

        val result = usuarioService.listarUsuariosAtivos()

        assertEquals(1, result.size)
        assertEquals("Teste", result[0].nome)
        verify { usuarioRepository.findByStatusTrue() }
    }

    @Test
    @DisplayName("Deve listar todos os usuários")
    fun `listarTodosUsuarios deve retornar lista de todos usuarios`() {
        val usuarios = listOf(
            Usuario(
                codigo = 1,
                nome = "Teste",
                email = "teste@teste.com",
                senha = "1234",
                instagram = "testeInsta",
                cpf = "12345678900",
                telefone = 123456789,
                telefoneEmergencial = 987654321,
                dataNasc = LocalDate.of(1990, 1, 1),
                genero = "Masculino",
                indicacao = null,
                foto = null,
                status = true,
                nivelAcesso = null,
                endereco = null,
                empresa = null,
                fichaAnamnese = null
            )
        )

        every { usuarioRepository.findAll() } returns usuarios

        val result = usuarioService.listarTodosUsuarios()

        assertEquals(1, result.size)
        assertEquals("Teste", result[0].nome)
        verify { usuarioRepository.findAll() }
    }

    @Test
    @DisplayName("Deve buscar usuário por código e retornar o mesmo")
    fun `buscarUsuarioPorCodigo deve retornar Usuario quando encontrado`() {
        val usuario = Usuario(
            codigo = 1,
            nome = "Teste",
            email = "teste@teste.com",
            senha = "1234",
            instagram = "testeInsta",
            cpf = "12345678900",
            telefone = 123456789,
            telefoneEmergencial = 987654321,
            dataNasc = LocalDate.of(1990, 1, 1),
            genero = "Masculino",
            indicacao = null,
            foto = null,
            status = true,
            nivelAcesso = null,
            endereco = null,
            empresa = null,
            fichaAnamnese = null
        )

        every { usuarioRepository.findById(1) } returns Optional.of(usuario)

        val result = usuarioService.buscarUsuarioPorCodigo(1)

        assertNotNull(result)
        assertEquals("Teste", result?.nome)
        verify { usuarioRepository.findById(1) }
    }

    @Test
    @DisplayName("Deve atualizar foto do usuário e retornar o mesmo")
    fun `atualizarFotoUsuario deve atualizar e retornar Usuario atualizado`() {
        val usuario = Usuario(
            codigo = 1,
            nome = "Teste",
            email = "teste@teste.com",
            senha = "1234",
            instagram = "testeInsta",
            cpf = "12345678900",
            telefone = 123456789,
            telefoneEmergencial = 987654321,
            dataNasc = LocalDate.of(1990, 1, 1),
            genero = "Masculino",
            indicacao = null,
            foto = null,
            status = true,
            nivelAcesso = null,
            endereco = null,
            empresa = null,
            fichaAnamnese = null
        )

        val imagem = ByteArray(10)

        every { usuarioRepository.findById(1) } returns Optional.of(usuario)
        every { usuarioRepository.save(any()) } returns usuario.copy(foto = imagem)

        val result = usuarioService.atualizarFotoUsuario(1, imagem)

        assertNotNull(result)
        assertArrayEquals(imagem, result?.foto)
        verify { usuarioRepository.save(any()) }
    }

    @Test
    @DisplayName("Deve retornar foto do usuário quando encontrado por código")
    fun `getFoto deve retornar ByteArray quando encontrado`() {
        val imagem = ByteArray(10)

        every { usuarioRepository.findFotoByCodigo(1) } returns imagem

        val result = usuarioService.getFoto(1)

        assertNotNull(result)
        assertArrayEquals(imagem, result)
        verify { usuarioRepository.findFotoByCodigo(1) }
    }

    @Test
    @DisplayName("Deve retornar usuário por CPF")
    fun `getByCPF deve retornar Usuario quando encontrado`() {
        val usuario = Usuario(
            codigo = 1,
            nome = "Teste",
            email = "teste@teste.com",
            senha = "1234",
            instagram = "testeInsta",
            cpf = "12345678900",
            telefone = 123456789,
            telefoneEmergencial = 987654321,
            dataNasc = LocalDate.of(1990, 1, 1),
            genero = "Masculino",
            indicacao = null,
            foto = null,
            status = true,
            nivelAcesso = null,
            endereco = null,
            empresa = null,
            fichaAnamnese = null
        )

        every { usuarioRepository.findByCpf("12345678900") } returns usuario

        val result = usuarioService.getByCPF("12345678900")

        assertNotNull(result)
        assertEquals("Teste", result?.nome)
        verify { usuarioRepository.findByCpf("12345678900") }
    }

    @Test
    @DisplayName("Deve retornar lista de usuários que contém nome")
    fun `getByNomeContains deve retornar lista de usuarios`() {
        val usuarios = listOf(
            Usuario(
                codigo = 1,
                nome = "Teste",
                email = "teste@teste.com",
                senha = "1234",
                instagram = "testeInsta",
                cpf = "12345678900",
                telefone = 123456789,
                telefoneEmergencial = 987654321,
                dataNasc = LocalDate.of(1990, 1, 1),
                genero = "Masculino",
                indicacao = null,
                foto = null,
                status = true,
                nivelAcesso = null,
                endereco = null,
                empresa = null,
                fichaAnamnese = null
            )
        )

        every { usuarioRepository.findByNomeContainsIgnoreCase("Teste") } returns usuarios

        val result = usuarioService.getByNomeContains("Teste")

        assertEquals(1, result.size)
        assertEquals("Teste", result[0].nome)
        verify { usuarioRepository.findByNomeContainsIgnoreCase("Teste") }
    }

    @Test
    @DisplayName("Deve retornar lista de usuários por nível de acesso")
    fun `getUsuariosByNivelAcesso deve retornar lista de usuarios`() {
        val nivelAcesso = mockk<NivelAcesso>()
        val usuarios = listOf(
            Usuario(
                codigo = 1,
                nome = "Teste",
                email = "teste@teste.com",
                senha = "1234",
                instagram = "testeInsta",
                cpf = "12345678900",
                telefone = 123456789,
                telefoneEmergencial = 987654321,
                dataNasc = LocalDate.of(1990, 1, 1),
                genero = "Masculino",
                indicacao = null,
                foto = null,
                status = true,
                nivelAcesso = nivelAcesso,
                endereco = null,
                empresa = null,
                fichaAnamnese = null
            )
        )

        every { nivelAcessoRepository.findById(1) } returns Optional.of(nivelAcesso)
        every { usuarioRepository.findByStatusTrueAndNivelAcesso(nivelAcesso) } returns usuarios

        val result = usuarioService.getUsuariosByNivelAcesso(1)

        assertEquals(1, result.size)
        assertEquals("Teste", result[0].nome)
        verify { usuarioRepository.findByStatusTrueAndNivelAcesso(nivelAcesso) }
    }

    @Test
    @DisplayName("Deve retornar lista de usuários por status")
    fun `getByStatus deve retornar lista de usuarios`() {
        val usuarios = listOf(
            Usuario(
                codigo = 1,
                nome = "Teste",
                email = "teste@teste.com",
                senha = "1234",
                instagram = "testeInsta",
                cpf = "12345678900",
                telefone = 123456789,
                telefoneEmergencial = 987654321,
                dataNasc = LocalDate.of(1990, 1, 1),
                genero = "Masculino",
                indicacao = null,
                foto = null,
                status = true,
                nivelAcesso = null,
                endereco = null,
                empresa = null,
                fichaAnamnese = null
            )
        )

        every { usuarioRepository.findByStatus(true) } returns usuarios

        val result = usuarioService.getByStatus(true)

        assertEquals(1, result.size)
        assertEquals("Teste", result[0].nome)
        verify { usuarioRepository.findByStatus(true) }
    }
}

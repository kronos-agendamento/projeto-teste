package sptech.projetojpa1.service

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.Mockito.*
import org.mockito.MockitoAnnotations
import sptech.projetojpa1.dominio.Comentario
import sptech.projetojpa1.dominio.Publicacao
import sptech.projetojpa1.dominio.Usuario
import sptech.projetojpa1.dto.comentario.ComentarioRequest
import sptech.projetojpa1.dto.publicacao.PublicacaoRequest
import sptech.projetojpa1.repository.ComentarioRepository
import sptech.projetojpa1.repository.PublicacaoRepository
import sptech.projetojpa1.repository.UsuarioRepository
import java.util.*

class BlogServiceTest {

    @Mock
    private lateinit var publicacaoRepository: PublicacaoRepository

    @Mock
    private lateinit var comentarioRepository: ComentarioRepository

    @Mock
    private lateinit var usuarioRepository: UsuarioRepository

    @InjectMocks
    private lateinit var blogService: BlogService

    @BeforeEach
    fun setUp() {
        MockitoAnnotations.openMocks(this)
    }

    @Test
    @DisplayName("Criar Publicação deve criar uma nova publicação")
    fun `criarPublicacao deve criar uma nova publicacao`() {
        val usuario = Usuario(1, "John Doe", "john@example.com")
        val request = PublicacaoRequest("Titulo", "Legenda", "Foto.jpg")

        `when`(usuarioRepository.findById(1)).thenReturn(Optional.of(usuario))
        `when`(publicacaoRepository.save(any(Publicacao::class.java)))
            .thenAnswer { invocation -> invocation.arguments[0] as Publicacao }

        val publicacao = blogService.criarPublicacao(request, 1)

        assertNotNull(publicacao)
        assertEquals("Titulo", publicacao.titulo)
        assertEquals("Legenda", publicacao.legenda)
        assertEquals("Foto.jpg", publicacao.foto)
        assertEquals(usuario, publicacao.usuario)
    }

    @Test
    @DisplayName("Adicionar Comentário deve adicionar um novo comentário")
    fun `adicionarComentario deve adicionar um novo comentario`() {
        val usuario = Usuario(1, "John Doe", "john@example.com")
        val publicacao = Publicacao(1, "Titulo", "Legenda", "Foto.jpg", 0, usuario)
        val request = ComentarioRequest("Texto do comentario", 1)

        `when`(usuarioRepository.findById(1)).thenReturn(Optional.of(usuario))
        `when`(publicacaoRepository.findById(1)).thenReturn(Optional.of(publicacao))
        `when`(comentarioRepository.save(any(Comentario::class.java)))
            .thenAnswer { invocation -> invocation.arguments[0] as Comentario }

        val comentario = blogService.adicionarComentario(request, 1)

        assertNotNull(comentario)
        assertEquals("Texto do comentario", comentario.texto)
        assertEquals(publicacao, comentario.publicacao)
        assertEquals(usuario, comentario.usuario)
    }

    @Test
    @DisplayName("Listar Publicações deve retornar todas as publicações")
    fun `listarPublicacoes deve retornar todas as publicacoes`() {
        val usuario1 = Usuario(1, "John Doe", "john@example.com")
        val usuario2 = Usuario(2, "Jane Doe", "jane@example.com")
        val publicacoes = listOf(
            Publicacao(1, "Titulo 1", "Legenda 1", "Foto1.jpg", 0, usuario1),
            Publicacao(2, "Titulo 2", "Legenda 2", "Foto2.jpg", 0, usuario2)
        )

        `when`(publicacaoRepository.findAll()).thenReturn(publicacoes)

        val result = blogService.listarPublicacoes()

        assertEquals(2, result.size)
        assertEquals("Titulo 1", result[0].titulo)
        assertEquals("Titulo 2", result[1].titulo)
    }

    @Test
    @DisplayName("Curtir Publicação deve aumentar o número de curtidas")
    fun `curtirPublicacao deve aumentar o numero de curtidas`() {
        val usuario = Usuario(1, "John Doe", "john@example.com")
        val publicacao = Publicacao(1, "Titulo", "Legenda", "Foto.jpg", 0, usuario)

        `when`(publicacaoRepository.findById(1)).thenReturn(Optional.of(publicacao))

        blogService.curtirPublicacao(1)

        verify(publicacaoRepository).save(publicacao)
        assertEquals(1, publicacao.curtidas)
    }

    @Test
    @DisplayName("Descurtir Publicação deve diminuir o número de curtidas")
    fun `descurtirPublicacao deve diminuir o numero de curtidas`() {
        val usuario = Usuario(1, "John Doe", "john@example.com")
        val publicacao = Publicacao(1, "Titulo", "Legenda", "Foto.jpg", 1, usuario)

        `when`(publicacaoRepository.findById(1)).thenReturn(Optional.of(publicacao))

        blogService.descurtirPublicacao(1)

        verify(publicacaoRepository).save(publicacao)
        assertEquals(0, publicacao.curtidas)
    }
}

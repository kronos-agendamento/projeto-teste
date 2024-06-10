import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.Mockito
import org.mockito.Mockito.verify
import org.mockito.Mockito.`when`
import org.mockito.MockitoAnnotations
import sptech.projetojpa1.dominio.Especificacao
import sptech.projetojpa1.dominio.Item
import sptech.projetojpa1.dominio.Pacote
import sptech.projetojpa1.dto.pacote.PacoteRequestDTO
import sptech.projetojpa1.repository.EspecificacaoRepository
import sptech.projetojpa1.repository.ItemRepository
import sptech.projetojpa1.repository.PacoteRepository
import sptech.projetojpa1.service.PacoteService
import java.util.*

class PacoteServiceTest {

    @InjectMocks
    private lateinit var pacoteService: PacoteService

    @Mock
    private lateinit var pacoteRepository: PacoteRepository

    @Mock
    private lateinit var itemRepository: ItemRepository

    @Mock
    private lateinit var especificacaoRepository: EspecificacaoRepository

    @BeforeEach
    fun setup() {
        MockitoAnnotations.initMocks(this)
    }

    @Test
    fun testCriarPacote() {
        val pacoteRequestDTO = PacoteRequestDTO(
            nome = "Pacote Teste",
            descontoColocacao = 10.0,
            descontoManutecao = 5.0,
            itens = listOf(
                PacoteRequestDTO.ItemDTO(especificacaoId = 1, quantidade = 2),
                PacoteRequestDTO.ItemDTO(especificacaoId = 2, quantidade = 3)
            )
        )

        // Mocking repository calls
        `when`(especificacaoRepository.findById(1)).thenReturn(Optional.of(Especificacao(1, "Especificação 1", 100.0, 50.0)))
        `when`(especificacaoRepository.findById(2)).thenReturn(Optional.of(Especificacao(2, "Especificação 2", 150.0, 75.0)))
        `when`(pacoteRepository.save(Mockito.any(Pacote::class.java))).thenReturn(Pacote(1, "Pacote Teste", 10, 5.0, 5.0))

        val pacoteDTO = pacoteService.criarPacote(pacoteRequestDTO)

        assertEquals("Pacote Teste", pacoteDTO.nome)
        assertEquals(2, pacoteDTO.itens.size)
    }

    @Test
    fun testListarPacotes() {
        // Mocking repository calls
        `when`(pacoteRepository.findAll()).thenReturn(listOf(Pacote(1, "Pacote 1", 10, 5.0, 5.0)))

        val pacotes = pacoteService.listarPacotes()

        assertEquals(1, pacotes.size)
        assertEquals("Pacote 1", pacotes[0].nome)
    }

    @Test
    fun testAtualizarItensPorNomePacote() {
        val pacote = Pacote(1, "Pacote Teste", 10, 5.0, 5.0)
        `when`(pacoteRepository.findByNomeContains("Pacote Teste")).thenReturn(listOf(pacote))

        val novosItens = listOf(
            PacoteRequestDTO.ItemDTO(especificacaoId = 3, quantidade = 1),
            PacoteRequestDTO.ItemDTO(especificacaoId = 4, quantidade = 2)
        )

        val item1 = Item(pacote = pacote, servico = 3, quantidade = 1)
        val item2 = Item(pacote = pacote, servico = 4, quantidade = 2)

        `when`(especificacaoRepository.findById(3)).thenReturn(Optional.of(Especificacao(3, "Especificação 3", 120.0, 60.0)))
        `when`(especificacaoRepository.findById(4)).thenReturn(Optional.of(Especificacao(4, "Especificação 4", 130.0, 65.0)))

        pacoteService.atualizarItensPorNomePacote("Pacote Teste", novosItens)

        // Verificar se os itens foram atualizados corretamente
        verify(itemRepository, Mockito.times(2)).save(Mockito.any(Item::class.java))
    }

    @Test
    fun testAtualizarDescontosPorNomePacote() {
        val pacote = Pacote(1, "Pacote Teste", 10, 5.0, 5.0)
        `when`(pacoteRepository.findByNomeContains("Pacote Teste")).thenReturn(listOf(pacote))

        pacoteService.atualizarDescontosPorNomePacote("Pacote Teste", 20.0, 15.0)

        // Verificar se os descontos foram atualizados corretamente
        assertEquals(20.0, pacote.descontoColocacao)
        assertEquals(15.0, pacote.descontoManutencao)
    }

    @Test
    fun testAtualizarNomePacote() {
        val pacote = Pacote(1, "Pacote Teste", 10, 5.0, 5.0)
        `when`(pacoteRepository.findById(1)).thenReturn(Optional.of(pacote))

        pacoteService.atualizarNomePacote(1, "Novo Nome do Pacote")

        // Verificar se o nome do pacote foi atualizado corretamente
        assertEquals("Novo Nome do Pacote", pacote.nome)
    }

    @Test
    fun testDeletarPacotesPorId() {
        val pacote = Pacote(1, "Pacote Teste", 10, 5.0, 5.0)
        val itens = listOf(Item(1, pacote, 1, 1), Item(2, pacote, 2, 2))
        `when`(itemRepository.findByPacoteId(1)).thenReturn(itens)

        pacoteService.deletarPacotesPorId(1)

        // Verificar se o pacote foi deletado corretamente
        verify(itemRepository).deleteAll(itens)
        verify(pacoteRepository).deleteById(1)
    }


    @Test
    fun testListarPacotesPorDescontoColocacaoEntre() {
        // Mocking repository calls
        `when`(pacoteRepository.findByDescontoColocacaoBetween(5.0, 10.0)).thenReturn(listOf(Pacote(1, "Pacote 1", 5, 10.0, 10.0)))

        val pacotes = pacoteService.listarPacotesPorDescontoColocacaoEntre(5.0, 10.0)

        assertEquals(1, pacotes.size)
        assertEquals("Pacote 1", pacotes[0].nome)
        // Adicione mais asserções conforme necessário para verificar outras propriedades
    }


    @Test
    fun testListarPacotesPorDescontoManutencaoEntre() {
        // Mocking repository calls
        `when`(pacoteRepository.findByDescontoManutencaoBetween(5.0, 10.0)).thenReturn(listOf(Pacote(1, "Pacote 1", 5, 10.0, 10.0)))

        val pacotes = pacoteService.listarPacotesPorDescontoManutencaoEntre(5.0, 10.0)

        assertEquals(1, pacotes.size)
        assertEquals("Pacote 1", pacotes[0].nome)
        // Adicione mais asserções conforme necessário para verificar outras propriedades
    }

    @Test
    fun testListarPacotesPorNome() {
        // Mocking repository calls
        `when`(pacoteRepository.findByNomeContains("Pacote")).thenReturn(listOf(Pacote(1, "Pacote 1", 5, 10.0, 10.0)))

        val pacotes = pacoteService.listarPacotesPorNome("Pacote")

        assertEquals(1, pacotes.size)
        assertEquals("Pacote 1", pacotes[0].nome)
        // Adicione mais asserções conforme necessário para verificar outras propriedades
    }


}

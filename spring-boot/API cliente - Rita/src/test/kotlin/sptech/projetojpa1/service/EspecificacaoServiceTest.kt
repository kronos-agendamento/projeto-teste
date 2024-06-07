package sptech.projetojpa1.service

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.Mockito
import org.mockito.junit.jupiter.MockitoExtension
import sptech.projetojpa1.dominio.Especificacao
import sptech.projetojpa1.dominio.Procedimento
import sptech.projetojpa1.dominio.TempoProcedimento
import sptech.projetojpa1.dto.especificacao.EspecificacaoDTO
import sptech.projetojpa1.repository.EspecificacaoRepository
import sptech.projetojpa1.repository.ProcedimentoRepository
import sptech.projetojpa1.repository.TempoProcedimentoRepository
import java.util.*

@ExtendWith(MockitoExtension::class)
class EspecificacaoServiceTest {

    @Mock
    private lateinit var especificacaoRepository: EspecificacaoRepository

    @Mock
    private lateinit var tempoProcedimentoRepository: TempoProcedimentoRepository

    @Mock
    private lateinit var procedimentoRepository: ProcedimentoRepository

    @InjectMocks
    private lateinit var especificacaoService: EspecificacaoService

    @Test
    @DisplayName("Teste de listagem de todas as especificações")
    fun `listarTodos should return a list of Especificacao`() {
        val especificacao = Especificacao(
            especificacao = "Especificação A",
            precoColocacao = 100.0,
            precoManutencao = 50.0,
            precoRetirada = 30.0,
            foto = null,
            fkTempoProcedimento = TempoProcedimento(1, "01:00", "00:30", "00:15"),
            fkProcedimento = Procedimento(1, "Tipo A", "Descrição A")
        )

        Mockito.`when`(especificacaoRepository.findAll()).thenReturn(listOf(especificacao))

        val result = especificacaoService.listarTodos()

        assertNotNull(result)
        assertEquals(1, result.size)
        assertEquals(especificacao.especificacao, result[0].especificacao)
    }

    @Test
    @DisplayName("Teste de busca de especificação por descrição")
    fun `listarPorEspecificacao should return Especificacao`() {
        val especificacao = Especificacao(
            especificacao = "Especificação A",
            precoColocacao = 100.0,
            precoManutencao = 50.0,
            precoRetirada = 30.0,
            foto = null,
            fkTempoProcedimento = TempoProcedimento(1, "01:00", "00:30", "00:15"),
            fkProcedimento = Procedimento(1, "Tipo A", "Descrição A")
        )

        Mockito.`when`(especificacaoRepository.findByEspecificacaoContainsIgnoreCase("Especificação A")).thenReturn(especificacao)

        val result = especificacaoService.listarPorEspecificacao("Especificação A")

        assertNotNull(result)
        assertEquals(especificacao.especificacao, result?.especificacao)
    }

    @Test
    @DisplayName("Teste de busca de especificação por ID")
    fun `listarPorId should return Especificacao`() {
        val especificacao = Especificacao(
            especificacao = "Especificação A",
            precoColocacao = 100.0,
            precoManutencao = 50.0,
            precoRetirada = 30.0,
            foto = null,
            fkTempoProcedimento = TempoProcedimento(1, "01:00", "00:30", "00:15"),
            fkProcedimento = Procedimento(1, "Tipo A", "Descrição A")
        )

        Mockito.`when`(especificacaoRepository.findById(1)).thenReturn(Optional.of(especificacao))

        val result = especificacaoService.listarPorId(1)

        assertNotNull(result)
        assertEquals(especificacao.especificacao, result?.especificacao)
    }

    @Test
    @DisplayName("Teste de cadastro de especificação com dados válidos")
    fun `cadastrar should create and return Especificacao`() {
        val dto = EspecificacaoDTO(
            especificacao = "Especificação A",
            precoColocacao = 100.0,
            precoManutencao = 50.0,
            precoRetirada = 30.0,
            fkTempoProcedimentoId = 1,
            fkProcedimentoId = 1
        )
        val tempoProcedimento = TempoProcedimento(1, "01:00", "00:30", "00:15")
        val procedimento = Procedimento(1, "Tipo A", "Descrição A")

        val especificacao = Especificacao(
            especificacao = dto.especificacao!!,
            precoColocacao = dto.precoColocacao!!,
            precoManutencao = dto.precoManutencao!!,
            precoRetirada = dto.precoRetirada!!,
            foto = null,
            fkTempoProcedimento = tempoProcedimento,
            fkProcedimento = procedimento
        )

        Mockito.`when`(tempoProcedimentoRepository.findById(1)).thenReturn(Optional.of(tempoProcedimento))
        Mockito.`when`(procedimentoRepository.findById(1)).thenReturn(Optional.of(procedimento))
        Mockito.`when`(especificacaoRepository.save(Mockito.any(Especificacao::class.java))).thenReturn(especificacao)

        val result = especificacaoService.cadastrar(dto)

        assertNotNull(result)
        assertEquals(dto.especificacao, result.especificacao)
        assertEquals(dto.precoColocacao, result.precoColocacao)
        assertEquals(dto.precoManutencao, result.precoManutencao)
        assertEquals(dto.precoRetirada, result.precoRetirada)
    }

    @Test
    @DisplayName("Teste de exclusão de especificação por descrição")
    fun `deletarPorEspecificacao should delete the especificacao`() {
        val especificacao = Especificacao(
            especificacao = "Especificação A",
            precoColocacao = 100.0,
            precoManutencao = 50.0,
            precoRetirada = 30.0,
            foto = null,
            fkTempoProcedimento = TempoProcedimento(1, "01:00", "00:30", "00:15"),
            fkProcedimento = Procedimento(1, "Tipo A", "Descrição A")
        )

        Mockito.`when`(especificacaoRepository.findByEspecificacaoContainsIgnoreCase("Especificação A")).thenReturn(especificacao)

        especificacaoService.deletarPorEspecificacao("Especificação A")

        Mockito.verify(especificacaoRepository).delete(especificacao)
    }

    @Test
    @DisplayName("Teste de edição de especificação por descrição")
    fun `editarPorDescricao should update and return Especificacao`() {
        val especificacaoExistente = Especificacao(
            especificacao = "Especificação A",
            precoColocacao = 100.0,
            precoManutencao = 50.0,
            precoRetirada = 30.0,
            foto = null,
            fkTempoProcedimento = TempoProcedimento(1, "01:00", "00:30", "00:15"),
            fkProcedimento = Procedimento(1, "Tipo A", "Descrição A")
        )
        val dto = EspecificacaoDTO(
            especificacao = "Nova Especificação",
            precoColocacao = 150.0,
            precoManutencao = 70.0,
            precoRetirada = 40.0,
            fkTempoProcedimentoId = 2,
            fkProcedimentoId = 2
        )
        val novoTempoProcedimento = TempoProcedimento(2, "02:00", "01:00", "00:30")
        val novoProcedimento = Procedimento(2, "Tipo B", "Descrição B")

        Mockito.`when`(especificacaoRepository.findByEspecificacaoContainsIgnoreCase("Especificação A")).thenReturn(especificacaoExistente)
        Mockito.`when`(tempoProcedimentoRepository.findById(2)).thenReturn(Optional.of(novoTempoProcedimento))
        Mockito.`when`(procedimentoRepository.findById(2)).thenReturn(Optional.of(novoProcedimento))
        Mockito.`when`(especificacaoRepository.save(Mockito.any(Especificacao::class.java))).thenReturn(especificacaoExistente)

        val result = especificacaoService.editarPorDescricao("Especificação A", dto)

        assertNotNull(result)
        assertEquals(dto.especificacao, result?.especificacao)
        assertEquals(dto.precoColocacao, result?.precoColocacao)
        assertEquals(dto.precoManutencao, result?.precoManutencao)
        assertEquals(dto.precoRetirada, result?.precoRetirada)
        assertEquals(novoTempoProcedimento, result?.fkTempoProcedimento)
        assertEquals(novoProcedimento, result?.fkProcedimento)
    }

    @Test
    @DisplayName("Teste de atualização de foto de especificação")
    fun `atualizarFotoEspecificacao should update and return Especificacao`() {
        val especificacao = Especificacao(
            especificacao = "Especificação A",
            precoColocacao = 100.0,
            precoManutencao = 50.0,
            precoRetirada = 30.0,
            foto = null,
            fkTempoProcedimento = TempoProcedimento(1, "01:00", "00:30", "00:15"),
            fkProcedimento = Procedimento(1, "Tipo A", "Descrição A")
        )

        val novaFoto = byteArrayOf(1, 2, 3)

        Mockito.`when`(especificacaoRepository.findById(1)).thenReturn(Optional.of(especificacao))
        Mockito.`when`(especificacaoRepository.save(Mockito.any(Especificacao::class.java))).thenReturn(especificacao)

        val result = especificacaoService.atualizarFotoEspecificacao(1, novaFoto)

        assertNotNull(result)
        assertArrayEquals(novaFoto, result?.foto)
    }

    @Test
    @DisplayName("Teste de obtenção de foto de especificação por código")
    fun `getFoto should return the foto`() {
        val foto = byteArrayOf(1, 2, 3)
        Mockito.`when`(especificacaoRepository.findFotoByCodigo(1)).thenReturn(foto)

        val result = especificacaoService.getFoto(1)

        assertNotNull(result)
        assertArrayEquals(foto, result)
    }
}

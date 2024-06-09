package sptech.projetojpa1.service

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.mockito.Mockito
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.mock.mockito.MockBean
import sptech.projetojpa1.dominio.Promocao
import sptech.projetojpa1.dto.promocao.PromocaoRequestDTO
import sptech.projetojpa1.repository.PromocaoRepository
import java.util.*

@SpringBootTest
class PromocaoServiceTest {

    @Autowired
    private lateinit var promocaoService: PromocaoService

    @MockBean
    private lateinit var promocaoRepository: PromocaoRepository

    private lateinit var promocao: Promocao
    private lateinit var promocaoRequestDTO: PromocaoRequestDTO

    @BeforeEach
    fun setUp() {
        promocao = Promocao(
            id = 1,
            tipoPromocao = "Desconto",
            descricao = "50% de desconto",
            dataInicio = Date(),
            dataFim = Date()
        )

        promocaoRequestDTO = PromocaoRequestDTO(
            tipoPromocao = "Desconto",
            descricao = "50% de desconto",
            dataInicio = Date(),
            dataFim = Date()
        )
    }

    @Test
    @DisplayName("Test Get All Promocoes")
    fun testGetAllPromocoes() {
        Mockito.`when`(promocaoRepository.findAll()).thenReturn(listOf(promocao))
        val result = promocaoService.getAllPromocoes()
        assertEquals(1, result.size)
        assertEquals(promocao.id, result[0].id)
    }

    @Test
    @DisplayName("Test Get Promocao By ID")
    fun testGetPromocaoById() {
        Mockito.`when`(promocaoRepository.findById(1)).thenReturn(Optional.of(promocao))
        val result = promocaoService.getPromocaoById(1)
        assertEquals(promocao.id, result.id)
    }

    @Test
    @DisplayName("Test Create Promocao")
    fun testCreatePromocao() {
        Mockito.`when`(promocaoRepository.save(Mockito.any(Promocao::class.java))).thenReturn(promocao)
        val result = promocaoService.createPromocao(promocaoRequestDTO)
        assertEquals(promocao.id, result.id)
    }

    @Test
    @DisplayName("Test Update Promocao")
    fun testUpdatePromocao() {
        Mockito.`when`(promocaoRepository.findById(1)).thenReturn(Optional.of(promocao))
        Mockito.`when`(promocaoRepository.save(Mockito.any(Promocao::class.java))).thenReturn(promocao)
        val result = promocaoService.updatePromocao(1, promocaoRequestDTO)
        assertEquals(promocao.id, result.id)
        assertEquals(promocao.tipoPromocao, result.tipoPromocao)
    }

    @Test
    @DisplayName("Test Delete Promocao")
    fun testDeletePromocao() {
        Mockito.doNothing().`when`(promocaoRepository).deleteById(1)
        promocaoService.deletePromocao(1)
        Mockito.verify(promocaoRepository, Mockito.times(1)).deleteById(1)
    }
}

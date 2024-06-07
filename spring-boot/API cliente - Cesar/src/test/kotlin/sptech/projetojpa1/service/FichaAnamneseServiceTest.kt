package sptech.projetojpa1.service

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.Mockito
import org.mockito.junit.jupiter.MockitoExtension
import sptech.projetojpa1.dominio.FichaAnamnese
import sptech.projetojpa1.dto.FichaRequest
import sptech.projetojpa1.repository.FichaAnamneseRepository
import java.time.LocalDateTime
import java.util.*

@ExtendWith(MockitoExtension::class)
class FichaAnamneseServiceTest {

    @Mock
    private lateinit var fichaAnamneseRepository: FichaAnamneseRepository

    @InjectMocks
    private lateinit var fichaAnamneseService: FichaAnamneseService

    @Test
    @DisplayName("Teste de cadastro de ficha de anamnese com dados válidos")
    fun `cadastrarFichaAnamnese should create and return FichaResponse`() {
        val novaFichaRequest = FichaRequest(
            dataPreenchimento = LocalDateTime.now()
        )
        val fichaAnamnese = FichaAnamnese(
            codigoFicha = 1,
            dataPreenchimento = novaFichaRequest.dataPreenchimento
        )

        Mockito.`when`(fichaAnamneseRepository.save(Mockito.any(FichaAnamnese::class.java)))
            .thenReturn(fichaAnamnese)

        val result = fichaAnamneseService.cadastrarFichaAnamnese(novaFichaRequest)

        assertNotNull(result)
        assertEquals(fichaAnamnese.codigoFicha, result.codigoFicha)
        assertEquals(fichaAnamnese.dataPreenchimento, result.dataPreenchimento)
    }

    @Test
    @DisplayName("Teste de listagem de todas as fichas de anamnese")
    fun `listarFichasAnamnese should return list of FichaResponse`() {
        val ficha1 = FichaAnamnese(
            codigoFicha = 1,
            dataPreenchimento = LocalDateTime.now()
        )
        val ficha2 = FichaAnamnese(
            codigoFicha = 2,
            dataPreenchimento = LocalDateTime.now()
        )
        val fichas = listOf(ficha1, ficha2)

        Mockito.`when`(fichaAnamneseRepository.findAll()).thenReturn(fichas)

        val result = fichaAnamneseService.listarFichasAnamnese()

        assertNotNull(result)
        assertEquals(2, result.size)
        assertEquals(ficha1.codigoFicha, result[0].codigoFicha)
        assertEquals(ficha1.dataPreenchimento, result[0].dataPreenchimento)
        assertEquals(ficha2.codigoFicha, result[1].codigoFicha)
        assertEquals(ficha2.dataPreenchimento, result[1].dataPreenchimento)
    }
}

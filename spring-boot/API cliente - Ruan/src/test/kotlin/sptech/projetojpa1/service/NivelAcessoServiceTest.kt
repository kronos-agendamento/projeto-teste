package sptech.projetojpa1.service

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.Mockito.`when`
import org.mockito.Mockito.any
import org.mockito.MockitoAnnotations
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import sptech.projetojpa1.dominio.NivelAcesso
import sptech.projetojpa1.dto.nivelacesso.NivelAcessoCreateDTO
import sptech.projetojpa1.dto.nivelacesso.NivelAcessoResponseDTO
import sptech.projetojpa1.dto.nivelacesso.NivelAcessoUpdateDTO
import sptech.projetojpa1.repository.NivelAcessoRepository
import java.util.Optional


class NivelAcessoServiceTest {

    @Mock
    lateinit var nivelAcessoRepository: NivelAcessoRepository

    @InjectMocks
    lateinit var nivelAcessoService: NivelAcessoService

    @BeforeEach
    fun setUp() {
        MockitoAnnotations.openMocks(this)
    }

    @Test
    fun `Teste cadastrarNivelAcesso - Retorna novo nível de acesso cadastrado`() {
        val dto = NivelAcessoCreateDTO("Nome", 1, "Descrição")

        val nivelAcesso = NivelAcesso(1, "Nome", 1, "Descrição")

        `when`(nivelAcessoRepository.save(any())).thenReturn(nivelAcesso)

        val result = nivelAcessoService.cadastrarNivelAcesso(dto)

        assertEquals(NivelAcessoResponseDTO(1, "Nome", 1, "Descrição"), result)
    }

    @Test
    fun `Teste listarNiveisAcesso - Retorna lista de níveis de acesso`() {
        val nivelAcesso = NivelAcesso(1, "Nome", 1, "Descrição")
        val nivelAcessoList = listOf(nivelAcesso)

        `when`(nivelAcessoRepository.findAll()).thenReturn(nivelAcessoList)

        val result = nivelAcessoService.listarNiveisAcesso()

        assertEquals(1, result.size)
        assertEquals(NivelAcessoResponseDTO(1, "Nome", 1, "Descrição"), result[0])
    }

    @Test
    fun `Teste atualizarNomeNivelAcesso - Atualiza nome do nível de acesso existente`() {
        val id = 1
        val dto = NivelAcessoUpdateDTO("Novo Nome")
        val nivelAcesso = NivelAcesso(1, "Nome", 1, "Descrição")
        `when`(nivelAcessoRepository.findById(id)).thenReturn(Optional.of(nivelAcesso))
        `when`(nivelAcessoRepository.save(nivelAcesso)).thenReturn(nivelAcesso)

        val result = nivelAcessoService.atualizarNomeNivelAcesso(id, dto)

        assertEquals(ResponseEntity.status(HttpStatus.OK).body("Nome atualizado com sucesso"), result)
    }

    @Test
    fun `Teste excluirNivelAcesso - Exclui nível de acesso existente`() {
        val id = 1
        val nivelAcesso = NivelAcesso(1, "Nome", 1, "Descrição")
        `when`(nivelAcessoRepository.findById(id)).thenReturn(Optional.of(nivelAcesso))

        val result = nivelAcessoService.excluirNivelAcesso(id)

        assertEquals(ResponseEntity.status(HttpStatus.OK).body("Nível de acesso excluído com sucesso"), result)
    }
}

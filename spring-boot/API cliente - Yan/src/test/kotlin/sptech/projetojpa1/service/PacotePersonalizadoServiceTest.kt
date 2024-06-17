package sptech.projetojpa1.service

import jakarta.transaction.Transactional
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import sptech.projetojpa1.dominio.Agendamento
import sptech.projetojpa1.dominio.Procedimento
import sptech.projetojpa1.dominio.Usuario
import sptech.projetojpa1.repository.AgendamentoRepository
import sptech.projetojpa1.repository.ProcedimentoRepository
import sptech.projetojpa1.repository.UsuarioRepository
import java.time.LocalDateTime

@SpringBootTest
class PacotePersonalizadoServiceTest {

    @Autowired
    private lateinit var pacotePersonalizadoService: PacotePersonalizadoService

    @Autowired
    private lateinit var usuarioRepository:UsuarioRepository

    @Autowired
    private lateinit var procedimentoRepository:ProcedimentoRepository

    @Autowired
    private lateinit var agendamentoRepository:AgendamentoRepository

    @Test
    @Transactional
    fun testarCriarPacotePersonalizado() {
        val usuario = usuarioRepository.save(Usuario(nome = "Rita", email = "rita@email.com"))
        val procedimento1 = procedimentoRepository.save(Procedimento(tipo = "cilios", descricao = "sim"))
        val procedimento2 =
            procedimentoRepository.save(Procedimento(tipo = "maquiagem", descricao = "maquiagem bonita"))
        val procedimento3 =
            procedimentoRepository.save(Procedimento(tipo = "sobranchelha", descricao = "sobrancelha monstra"))

        agendamentoRepository.save(
            Agendamento(
                usuario = usuario,
                procedimento = procedimento1,
                data = LocalDateTime.now().minusDays(1)
            )
        )
        agendamentoRepository.save(
            Agendamento(
                usuario = usuario,
                procedimento = procedimento2,
                data = LocalDateTime.now().minusDays(2)
            )
        )
        agendamentoRepository.save(
            Agendamento(
                usuario = usuario,
                procedimento = procedimento3,
                data = LocalDateTime.now().minusDays(3)
            )
        )

        val pacote = pacotePersonalizadoService.criarPacote(usuario.codigo, 6, 10.0)

        assertEquals(3, pacote.procedimento.size)
        assertEquals(procedimento1, pacote.procedimento[0])
        assertEquals(procedimento2, pacote.procedimento[1])
        assertEquals(procedimento3, pacote.procedimento[2])

    }
}
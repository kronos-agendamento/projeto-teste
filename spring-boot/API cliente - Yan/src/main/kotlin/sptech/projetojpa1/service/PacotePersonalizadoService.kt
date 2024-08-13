package sptech.projetojpa1.service

import jakarta.transaction.Transactional
import org.springframework.stereotype.Service
import sptech.projetojpa1.dominio.PacotePersonalizado
import sptech.projetojpa1.dominio.Procedimento
import sptech.projetojpa1.dominio.Usuario
import sptech.projetojpa1.repository.AgendamentoRepository
import sptech.projetojpa1.repository.PacotePersonalizadoRepository
import sptech.projetojpa1.repository.ProcedimentoRepository
import sptech.projetojpa1.repository.UsuarioRepository

@Service
class PacotePersonalizadoService(
    private val usuarioRepository: UsuarioRepository,
    private val procedimentoRepository: ProcedimentoRepository,
    private val pacotePersonalizadoRepository: PacotePersonalizadoRepository,
    private val agendamentoRepository: AgendamentoRepository
) {

    fun obterProcedimentosFrequentes(usuario: Usuario): List<Procedimento> {
        val agendamentos = agendamentoRepository.findByUsuario(usuario)

        val frequencia = agendamentos.groupBy { it.procedimento }
            .mapValues { it.value.size }
            .toList()
            .sortedByDescending { it.second }
            .map { it.first }

        return frequencia.take(3)
    }

    @Transactional
    fun criarPacote(id: Int, mes: Int, desconto: Double): PacotePersonalizado {
        val usuario = usuarioRepository.findById(id).orElseThrow { IllegalArgumentException("Cliente não encontrado") }

        val procedimentosFrequentes = obterProcedimentosFrequentes(usuario)

        val pacote = PacotePersonalizado(
            usuario = usuario,
            mes = mes,
            procedimentos = procedimentosFrequentes, // Certifique-se de que PacotePersonalizado aceita uma lista de procedimentos
            descontoProcedimento = desconto
        )
        return pacotePersonalizadoRepository.save(pacote)
    }
}

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
     val usuarioRepository: UsuarioRepository,
     val procedimentoRepository: ProcedimentoRepository,
     val pacotePersonalizadoRepository:PacotePersonalizadoRepository,
     val agendamentoRepository:AgendamentoRepository
) {

    fun obterProcedimentoFrequente(usuario: Usuario):List<Procedimento>{
        val agendamentos = agendamentoRepository.findByUsuario(usuario)

        val frequencia = agendamento.groupBy{it.procedimento}
            .mapValues{it.value.size}
            .toList()
            .sortedByDescending{it.second}
            .map{it.first}

        return frequencia.take(3)
    }

    @Transactional
    fun criarPacote(Id:Int, mes:Int, desconto:Double): PacotePersonalizado {
        val usuario = usuarioRepository.findById(Id).orElseThrow{IllegalArgumentException("Cliente não encontrado")}

        val procedimentoFrequente = obterProcedimentoFrequente(usuario)

        val pacote = PacotePersonalizado(
            usuario = usuario,
            mes = mes,
            procedimento = procedimentoFrequente,
            descontoProcedimento = desconto
        )
        return pacotePersonalizadoRepository.save(pacote)
    }



}
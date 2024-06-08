package sptech.projetojpa1.service

import org.springframework.stereotype.Service
import sptech.projetojpa1.dominio.HorarioFuncionamento
import sptech.projetojpa1.dominio.Status
import sptech.projetojpa1.dto.horario.HorarioFuncionamentoRequest
import sptech.projetojpa1.dto.status.StatusResponse
import sptech.projetojpa1.repository.HorarioFuncionamentoRepository
import java.util.*

@Service
data class HorarioFuncionamentoService(
    val repository: HorarioFuncionamentoRepository
) {

    fun cadastrarHorarioFuncionamento(novoHorario: HorarioFuncionamentoRequest): HorarioFuncionamento {
        val horario = HorarioFuncionamento(
            codigo = 0,
            diaSemana = novoHorario.diaSemana,
            horarioAbertura = novoHorario.horarioAbertura,
            horarioFechamento = novoHorario.horarioFechamento
        )
        return repository.save(horario)
    }

    fun listarHorariosFuncionamento(): List<HorarioFuncionamento> {
        return repository.findAll()
    }

    fun excluirHorarioFuncionamento(id: Int): Boolean {
        return if (repository.existsById(id)) {
            repository.deleteById(id)
            true
        } else {
            false
        }
    }

    fun atualizarHorarioAbertura(id: Int, novoHorarioAbertura: String): Boolean {
        val horarioOptional = repository.findById(id)
        return if (horarioOptional.isPresent) {
            val horario = horarioOptional.get()
            horario.horarioAbertura = novoHorarioAbertura
            repository.save(horario)
            true
        } else {
            false
        }
    }

    fun atualizarHorarioFechamento(id: Int, novoHorarioFechamento: String): Boolean {
        val horarioOptional = repository.findById(id)
        return if (horarioOptional.isPresent) {
            val horario = horarioOptional.get()
            horario.horarioFechamento = novoHorarioFechamento
            repository.save(horario)
            true
        } else {
            false
        }
    }

}
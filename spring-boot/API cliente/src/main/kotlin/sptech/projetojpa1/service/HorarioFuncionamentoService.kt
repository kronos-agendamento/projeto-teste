package sptech.projetojpa1.service

import org.springframework.stereotype.Service
import sptech.projetojpa1.dominio.HorarioFuncionamento
import sptech.projetojpa1.dto.horario.HorarioFuncionamentoRequest
import sptech.projetojpa1.repository.HorarioFuncionamentoRepository

@Service
class HorarioFuncionamentoService(
    private val repository: HorarioFuncionamentoRepository
) {

    fun cadastrarHorarioFuncionamento(request: HorarioFuncionamentoRequest): HorarioFuncionamento {
        val horario = HorarioFuncionamento(
            diaInicio = request.diaInicio,
            diaFim = request.diaFim,
            horarioAbertura = request.horarioAbertura,
            horarioFechamento = request.horarioFechamento
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

    fun atualizarHorarioFuncionamento(id: Int, request: HorarioFuncionamentoRequest): Boolean {
        val horarioOptional = repository.findById(id)
        return if (horarioOptional.isPresent) {
            val horario = horarioOptional.get()
            horario.diaInicio = request.diaInicio
            horario.diaFim = request.diaFim
            horario.horarioAbertura = request.horarioAbertura
            horario.horarioFechamento = request.horarioFechamento
            repository.save(horario)
            true
        } else {
            false
        }
    }
}

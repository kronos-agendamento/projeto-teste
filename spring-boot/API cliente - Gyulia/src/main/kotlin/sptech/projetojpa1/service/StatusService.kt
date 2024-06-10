package sptech.projetojpa1.service

import org.springframework.stereotype.Service
import sptech.projetojpa1.dominio.Status
import sptech.projetojpa1.dto.status.StatusRequest
import sptech.projetojpa1.dto.status.StatusResponse
import sptech.projetojpa1.repository.StatusRepository

@Service
class StatusService(private val repository: StatusRepository) {

    fun createStatus(statusCreateDTO: StatusRequest): StatusResponse {
        val status = Status(
            id = null,
            nome = statusCreateDTO.nome,
            cor = statusCreateDTO.cor,
            motivo = statusCreateDTO.motivo
        )
        val savedStatus = repository.save(status)
        return StatusResponse(savedStatus.id, savedStatus.nome, savedStatus.cor, savedStatus.motivo)
    }

    fun getAllStatuses(): List<StatusResponse> {
        return repository.findAll().map { status ->
            StatusResponse(status.id, status.nome, status.cor, status.motivo)
        }
    }

    fun getStatusById(id: Int): StatusResponse? {
        val status = repository.findById(id).orElse(null) ?: return null
        return StatusResponse(status.id, status.nome, status.cor, status.motivo)
    }

    fun deleteStatus(id: Int): Boolean {
        return if (repository.existsById(id)) {
            repository.deleteById(id)
            true
        } else {
            false
        }
    }

    fun updateStatus(id: Int, motivo: String?): StatusResponse? {
        val status = repository.findById(id).orElse(null) ?: return null
        if (motivo.isNullOrBlank()) {
            throw IllegalArgumentException("O campo 'motivo' é obrigatório.")
        }
        status.motivo = motivo
        val updatedStatus = repository.save(status)
        return StatusResponse(updatedStatus.id, updatedStatus.nome, updatedStatus.cor, updatedStatus.motivo)
    }
}

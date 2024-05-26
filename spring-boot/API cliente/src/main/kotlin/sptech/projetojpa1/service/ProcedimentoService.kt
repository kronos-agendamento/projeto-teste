package sptech.projetojpa1.service

import jakarta.transaction.Transactional
import jakarta.validation.Valid
import org.springframework.stereotype.Service
import sptech.projetojpa1.dominio.Procedimento
import sptech.projetojpa1.repository.ProcedimentoRepository

@Service
class ProcedimentoService(private val procedimentoRepository: ProcedimentoRepository) {

    // Método para buscar todos os procedimentos
    fun findAll(): List<Procedimento> = procedimentoRepository.findAll()

    // Método para buscar um procedimento por ID
    fun findById(id: Int): Procedimento? = procedimentoRepository.findById(id).orElse(null)

    // Método para salvar um novo procedimento
    @Transactional
    fun save(@Valid procedimento: Procedimento): Procedimento = procedimentoRepository.save(procedimento)

    // Método para atualizar um procedimento existente
    @Transactional
    fun update(id: Int, @Valid procedimento: Procedimento): Procedimento {
        // Verifica se o procedimento com o ID especificado existe
        if (!procedimentoRepository.existsById(id)) {
            throw IllegalArgumentException("Procedimento não encontrado")
        }
        // Define o ID do procedimento a ser atualizado e o salva
        procedimento.id = id
        return procedimentoRepository.save(procedimento)
    }

    // Método para excluir um procedimento
    @Transactional
    fun delete(id: Int) {
        // Verifica se o procedimento com o ID especificado existe
        if (!procedimentoRepository.existsById(id)) {
            throw IllegalArgumentException("Procedimento não encontrado")
        }
        // Exclui o procedimento com o ID especificado
        procedimentoRepository.deleteById(id)
    }
}

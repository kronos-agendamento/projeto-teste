package sptech.projetojpa1.repository

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import sptech.projetojpa1.dominio.Complemento

// Interface que define operações de acesso aos dados para a entidade Complemento
interface ComplementoRepository : JpaRepository<Complemento, Int> {

    // Consulta personalizada para buscar complementos por ID de endereço
    @Query("SELECT c FROM Complemento c WHERE c.endereco.codigo = :id")
    fun findByEnderecoId(id: Int): List<Complemento>
}

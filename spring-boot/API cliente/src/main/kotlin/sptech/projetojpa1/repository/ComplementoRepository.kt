package sptech.projetojpa1.repository

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import sptech.projetojpa1.dominio.Complemento
import sptech.projetojpa1.dominio.Endereco

// Interface que define operações de acesso aos dados para a entidade Complemento
interface ComplementoRepository : JpaRepository<Complemento, Int> {

    // Consulta personalizada para buscar complementos por ID de endereço
    @Query("SELECT c FROM Complemento c WHERE c.endereco.codigo = :id AND c.complemento = :complemento")
    fun findByEnderecoIdAndComplemento(id: Int, complemento: String): List<Complemento>


}

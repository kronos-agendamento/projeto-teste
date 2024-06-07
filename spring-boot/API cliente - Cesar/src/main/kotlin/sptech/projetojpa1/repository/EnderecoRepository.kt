package sptech.projetojpa1.repository

import org.springframework.data.jpa.repository.JpaRepository
import sptech.projetojpa1.dominio.Endereco

// Interface que estende JpaRepository para operações de persistência do Endereço
interface EnderecoRepository : JpaRepository<Endereco, Int> {

    // Método para encontrar endereços por CEP
    fun findByCepContains(cep: String): List<Endereco>

    // Método para encontrar endereços por bairro, ignorando maiúsculas e minúsculas
    fun findByBairroContainsIgnoreCase(bairro: String): List<Endereco>

    // Método para encontrar endereços por nome de usuário
//    fun findByUsuarioNomeContains(nomeUsuario: String): List<Endereco>
}

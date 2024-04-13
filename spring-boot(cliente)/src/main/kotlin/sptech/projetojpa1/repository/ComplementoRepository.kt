package sptech.projetojpa1.repository

import org.springframework.data.jpa.repository.JpaRepository
import sptech.projetojpa1.dominio.Cliente
import sptech.projetojpa1.dominio.Complemento
import sptech.projetojpa1.dominio.Endereco

interface ComplementoRepository: JpaRepository<Complemento, Int> {

}
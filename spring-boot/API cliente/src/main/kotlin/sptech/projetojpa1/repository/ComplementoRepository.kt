package sptech.projetojpa1.repository

import org.springframework.data.jpa.repository.JpaRepository
import sptech.projetojpa1.dominio.Complemento

interface ComplementoRepository: JpaRepository<Complemento, Int> {

}
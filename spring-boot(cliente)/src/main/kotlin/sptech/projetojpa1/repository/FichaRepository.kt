package sptech.projetojpa1.repository

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.repository.support.Repositories
import sptech.projetojpa1.dominio.Ficha

interface FichaRepository:JpaRepository<Ficha, Int> {
}
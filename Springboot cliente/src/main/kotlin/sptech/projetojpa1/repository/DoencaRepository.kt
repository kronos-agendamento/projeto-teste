package sptech.projetojpa1.repository

import org.springframework.data.jpa.repository.JpaRepository
import sptech.projetojpa1.dominio.Doenca

interface DoencaRepository:JpaRepository<Doenca, Int> {
}
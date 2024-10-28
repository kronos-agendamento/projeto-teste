package sptech.projetojpa1.repository

import org.springframework.data.jpa.repository.JpaRepository
import sptech.projetojpa1.domain.usuario.Profissional

interface ProfissionalRepository : JpaRepository<Profissional, Int> {
}

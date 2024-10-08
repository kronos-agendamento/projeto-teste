package sptech.projetojpa1.repository

import org.springframework.data.jpa.repository.JpaRepository
import sptech.projetojpa1.domain.FichaAnamnese

// Repositório para a entidade FichaAnamnese
interface FichaAnamneseRepository : JpaRepository<FichaAnamnese, Int> {
}

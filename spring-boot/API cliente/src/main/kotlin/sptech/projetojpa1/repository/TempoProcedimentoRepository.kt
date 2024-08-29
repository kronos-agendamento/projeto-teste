package sptech.projetojpa1.repository

import org.springframework.data.jpa.repository.JpaRepository
import sptech.projetojpa1.domain.TempoProcedimento

interface TempoProcedimentoRepository : JpaRepository<TempoProcedimento, Int> {
}
package sptech.projetojpa1.repository

import org.springframework.data.jpa.repository.JpaRepository
import sptech.projetojpa1.dominio.Procedimento

interface ProcedimentoRepository : JpaRepository<Procedimento, Int>

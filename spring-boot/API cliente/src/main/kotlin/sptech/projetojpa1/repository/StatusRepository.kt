package sptech.projetojpa1.repository

import org.springframework.data.jpa.repository.JpaRepository
import sptech.projetojpa1.dominio.Status

// Interface responsável pela comunicação com o banco de dados para a entidade Status
interface StatusRepository : JpaRepository<Status, Int> {
}

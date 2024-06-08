package sptech.projetojpa1.repository

import org.springframework.data.jpa.repository.JpaRepository
import sptech.projetojpa1.dominio.NivelAcesso

// Interface que estende JpaRepository para operações de banco de dados relacionadas a NivelAcesso
interface NivelAcessoRepository : JpaRepository<NivelAcesso, Int> {
}

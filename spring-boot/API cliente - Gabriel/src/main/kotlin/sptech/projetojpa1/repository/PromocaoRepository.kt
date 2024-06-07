package sptech.projetojpa1.repository


import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import sptech.projetojpa1.dominio.Promocao

@Repository
interface PromocaoRepository : JpaRepository<Promocao, Int>

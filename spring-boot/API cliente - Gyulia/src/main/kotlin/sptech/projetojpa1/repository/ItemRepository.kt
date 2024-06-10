package sptech.projetojpa1.repository

import org.springframework.data.jpa.repository.JpaRepository
import sptech.projetojpa1.dominio.Item

interface ItemRepository : JpaRepository<Item, Int> {
    fun findByPacoteId(pacoteId: Int): List<Item>
}
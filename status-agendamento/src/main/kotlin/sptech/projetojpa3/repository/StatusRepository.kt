package sptech.projetojpa3.repository


import sptech.projetojpa3.dominio.Status
import org.springframework.data.jpa.repository.JpaRepository


interface StatusRepository: JpaRepository<Status, Int> {

}
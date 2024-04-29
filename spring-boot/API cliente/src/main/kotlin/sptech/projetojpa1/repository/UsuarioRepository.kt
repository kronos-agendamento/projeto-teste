package sptech.projetojpa1.repository

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import sptech.projetojpa1.dominio.NivelAcesso
import sptech.projetojpa1.dominio.Usuario

interface UsuarioRepository : JpaRepository<Usuario, Int>{
    fun findByNome(nome:String):List<Usuario>

    fun findByStatusTrue():List<Usuario>
    fun findByStatusTrueAndNivelAcesso(NivelAcesso:NivelAcesso ):List<Usuario>

    @Query("select u.foto from Usuario u where u.codigo = ?1")
    fun findFotoByCodigo(codigo:Int):ByteArray

}
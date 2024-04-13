package sptech.projetojpa1.repository

import org.springframework.data.jpa.repository.JpaRepository
import sptech.projetojpa1.dominio.Musica
import java.time.LocalDate
import java.util.Optional

/*
Uma Repository centraliza os comandos de acesso a banco de dados
de uma entidade (tabela)

JpaRepository<1,2>
1 - Classe da Entidade
2 - Classe do Id (PK) da Entidade

Não é necessário criar uma implementação dessa interface.
O Spring criará uma com os comandos SQL para o banco de dados que estivermos usando
 */

interface MusicaRepository : JpaRepository<Musica, Int> {
    fun findByNome(nome:String): List<Musica>
    fun findByNomeContains(nome:String): List<Musica>
    fun findByLancamentoAfter(data: LocalDate):List<Musica>
    fun findTop1ByOrderByLancamentoDesc(): Optional<Musica>
    fun findByClassicoTrue():List<Musica>
    fun findByEstiloAndClassico(estilo:String,classico:Boolean):List<Musica>
    fun findTop3ByOrderByTotalOuvintesDesc():List<Musica>
    fun countByEstilo(estilo:String):Int

}
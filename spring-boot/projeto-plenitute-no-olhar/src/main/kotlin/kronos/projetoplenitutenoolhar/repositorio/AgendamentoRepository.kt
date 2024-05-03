package kronos.projetoplenitutenoolhar.repositorio

import kronos.projetoplenitutenoolhar.dominio.Agendamento
import org.springframework.data.jpa.repository.JpaRepository

interface AgendamentoRepository: JpaRepository<Agendamento, Int>{
//       fun findById(id:Int):List<Agendamento>
        fun findByStatus(status:Boolean):List<Agendamento>
        fun findByUsuario(usuario:Usuario):List<Agendamento>
        /*DEVE SER IDEALIZADA UMA BUSCA POR DATA, MAS COMO AINDA NÃO SEI FAZER ISSO, NÃO COLOQUEI!!!*/
}
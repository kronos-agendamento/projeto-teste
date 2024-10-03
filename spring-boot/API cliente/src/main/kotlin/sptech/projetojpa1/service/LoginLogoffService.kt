package sptech.projetojpa1.service

import org.springframework.stereotype.Service
import sptech.projetojpa1.repository.LoginLogoffRepository

@Service
class LoginLogoffService(
    private val loginLogoffRepository: LoginLogoffRepository
) {

    fun getUsuariosQueRetornaramAposUmMes(): Int {
        return loginLogoffRepository.findUsuariosQueRetornaramAposUmMes()
    }


}

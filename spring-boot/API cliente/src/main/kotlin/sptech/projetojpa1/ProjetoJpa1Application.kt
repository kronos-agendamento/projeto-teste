package sptech.projetojpa1

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.transaction.annotation.EnableTransactionManagement

@SpringBootApplication
class ProjetoJpa1Application

fun main(args: Array<String>) {
    runApplication<ProjetoJpa1Application>(*args)
}
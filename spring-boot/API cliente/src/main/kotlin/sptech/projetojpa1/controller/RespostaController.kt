package sptech.projetojpa1.controller

import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import sptech.projetojpa1.dominio.Resposta
import sptech.projetojpa1.repository.RespostaRepository


@RestController
@RequestMapping("/resposta")
class RespostaController(
    val respostaRepository: RespostaRepository
) {

    @PostMapping()
    fun post(@RequestBody @Valid novaResposta: Resposta): ResponseEntity<Resposta> {
        val respostaSalva = respostaRepository.save(novaResposta)

        return ResponseEntity.status(201).body(respostaSalva)
    }

    @GetMapping()
    fun get(): ResponseEntity<List<Resposta>> {
        val respostas = respostaRepository.findAll()

        if (respostas.isEmpty()) {
            return ResponseEntity.status(204).build()
        }
        return ResponseEntity.status(200).body(respostas)
    }

    @GetMapping("/usuario/{cpf}")
    fun getByUser(@PathVariable cpf: String): ResponseEntity<List<Map<String, Any?>>> {
        val respostas = respostaRepository.findByUsuarioCpf(cpf)
        return if (respostas.isEmpty()) {
            ResponseEntity.noContent().build()
        } else {
            val respostasComUsuario = respostas.map { resposta ->
                mapOf(
                    "resposta" to resposta.resposta,
                    "nomeUsuario" to resposta.usuario.nome,
                    "cpfUsuario" to resposta.usuario.cpf,
                    "dataPreenchimentoFicha" to resposta.ficha.dataPreenchimento
                )
            }
            ResponseEntity.ok(respostasComUsuario)
        }
    }

    @GetMapping("/pergunta/{descricao}")
    fun getByQuestion(@PathVariable descricao: String): ResponseEntity<List<Map<String, Any?>>> {
        val respostas = respostaRepository.findByPerguntaDescricao(descricao)
        return if (respostas.isEmpty()) {
            ResponseEntity.noContent().build()
        } else {
            val respostasComPergunta = respostas.map { resposta ->
                mapOf(
                    "resposta" to resposta.resposta,
                    "descricaoPergunta" to resposta.pergunta.descricao,
                    "tipoPergunta" to resposta.pergunta.tipo,
                    "nomeUsuario" to resposta.usuario.nome,
                    "cpfUsuario" to resposta.usuario.cpf,
                    "dataPreenchimentoFicha" to resposta.ficha.dataPreenchimento
                )
            }
            ResponseEntity.ok(respostasComPergunta)
        }
    }
}

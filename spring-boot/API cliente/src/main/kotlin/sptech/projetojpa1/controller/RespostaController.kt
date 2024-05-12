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

    @PostMapping("/cadastro-resposta")
    fun post(@RequestBody @Valid novaResposta: Resposta): ResponseEntity<Any> {
        val respostaSalva = respostaRepository.save(novaResposta)

        return ResponseEntity.status(201).body("Resposta ${respostaSalva.resposta} cadastrada com sucesso")
    }

    @GetMapping("/lista-todas-respostas")
    fun get(): ResponseEntity<Any> {
        val respostas = respostaRepository.findAll()

        if (respostas.isEmpty()) {
            return ResponseEntity.status(204).body("Nenhuma resposta foi cadastrada.")
        }
        return ResponseEntity.status(200).body(respostas)
    }

    @GetMapping("/filtro-por-cpf/{cpf}")
    fun getByUser(@Valid @PathVariable cpf: String): ResponseEntity<Any> {
        val respostas = respostaRepository.findByUsuarioCpf(cpf)
        return if (respostas.isEmpty()) {
            return ResponseEntity.status(204).body("Nenhuma resposta foi cadastrada para esse cliente.")
        } else {
            val respostasComUsuario = respostas.map { resposta ->
                mapOf(
                    "resposta" to resposta.resposta,
                    "nomeUsuario" to resposta.usuario.nome,
                    "cpfUsuario" to resposta.usuario.cpf,
                    "dataPreenchimentoFicha" to resposta.ficha.dataPreenchimento
                )
            }
            ResponseEntity.status(200).body(respostasComUsuario)
        }
    }

    @GetMapping("/filtro-por-pergunta/{nome}")
    fun getByQuestion(@Valid @PathVariable nome: String): ResponseEntity<Any> {
        val respostas = respostaRepository.findByPerguntaDescricao(nome)
        return if (respostas.isEmpty()) {
            return ResponseEntity.status(204).body("Nenhuma pergunta foi encontrada vinculada à essa pergunta.")
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
            ResponseEntity.status(200).body(respostasComPergunta)
        }
    }

    @DeleteMapping("/respostas/{id}")
    fun deletarResposta(@PathVariable id: Int): ResponseEntity<String> {
        val resposta = respostaRepository.findById(id)
        if (resposta.isPresent) {
            respostaRepository.deleteById(id)
            return ResponseEntity.status(200).body("Resposta excluída com sucesso.")
        }
        return ResponseEntity.status(404).body("Resposta não encontrada para o ID fornecido.")
    }
}

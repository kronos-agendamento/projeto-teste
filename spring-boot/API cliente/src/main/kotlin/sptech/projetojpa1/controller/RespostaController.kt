package sptech.projetojpa1.controller

import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import sptech.projetojpa1.dominio.Resposta
import sptech.projetojpa1.repository.RespostaRepository

@RestController
@RequestMapping("/ficha-resposta")
class RespostaController(
    val respostaRepository: RespostaRepository
) {

    // Cadastro de Nova Resposta
    @PostMapping("/cadastro-resposta")
    fun cadastrarResposta(@RequestBody @Valid novaResposta: Resposta): ResponseEntity<Any> {
        val respostaSalva = respostaRepository.save(novaResposta)

        return ResponseEntity.status(201).body("Resposta ${respostaSalva.resposta} cadastrada com sucesso")
    }

    // Listar Todas as Respostas
    @GetMapping("/lista-todas-respostas")
    fun listarTodasRespostas(): ResponseEntity<Any> {
        val respostas = respostaRepository.findAll()

        if (respostas.isEmpty()) {
            return ResponseEntity.status(204).body("Nenhuma resposta foi cadastrada.")
        }
        return ResponseEntity.status(200).body(respostas)
    }

    // Filtrar Respostas por CPF do Usuário
    @GetMapping("/filtro-por-cpf/{cpf}")
    fun filtrarPorCpf(@Valid @PathVariable cpf: String): ResponseEntity<Any> {
        val respostas = respostaRepository.findByUsuarioCpf(cpf)
        return if (respostas.isEmpty()) {
            ResponseEntity.status(204).body("Nenhuma resposta foi cadastrada para esse cliente.")
        } else {
            // Mapeando as respostas para um formato específico antes de retornar
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

    // Filtrar Respostas por Descrição da Pergunta
    @GetMapping("/filtro-por-pergunta/{nome}")
    fun filtrarPorPergunta(@Valid @PathVariable nome: String): ResponseEntity<Any> {
        val respostas = respostaRepository.findByPerguntaDescricao(nome)
        return if (respostas.isEmpty()) {
            ResponseEntity.status(204).body("Nenhuma pergunta foi encontrada vinculada à essa pergunta.")
        } else {
            // Mapeando as respostas para um formato específico antes de retornar
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

    // Excluir Resposta por ID
    @DeleteMapping("/exclusao-resposta/{id}")
    fun excluirResposta(@PathVariable id: Int): ResponseEntity<String> {
        val respostaOptional = respostaRepository.findById(id)
        return if (respostaOptional.isPresent) {
            respostaRepository.deleteById(id)
            ResponseEntity.status(200).body("Resposta excluída com sucesso.")
        } else {
            ResponseEntity.status(404).body("Resposta não encontrada para o ID fornecido.")
        }
    }
}

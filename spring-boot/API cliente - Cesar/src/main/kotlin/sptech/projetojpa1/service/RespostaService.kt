package sptech.projetojpa1.service

import org.springframework.stereotype.Service
import sptech.projetojpa1.dto.resposta.RespostaRequestDTO
import sptech.projetojpa1.dto.resposta.RespostaResponseDTO
import sptech.projetojpa1.dto.resposta.RespostaFilteredDTO
import sptech.projetojpa1.dominio.Resposta
import sptech.projetojpa1.dto.resposta.RespostaPersonalidade
import sptech.projetojpa1.repository.RespostaRepository
import sptech.projetojpa1.repository.PerguntaRepository
import sptech.projetojpa1.repository.FichaAnamneseRepository
import sptech.projetojpa1.repository.UsuarioRepository

@Service
class RespostaService(
    private val respostaRepository: RespostaRepository,
    private val perguntaRepository: PerguntaRepository,
    private val fichaAnamneseRepository: FichaAnamneseRepository,
    private val usuarioRepository: UsuarioRepository
) {

    fun cadastrarResposta(novaResposta: RespostaRequestDTO): RespostaResponseDTO {
        val pergunta = perguntaRepository.findById(novaResposta.perguntaId)
            .orElseThrow { IllegalArgumentException("Pergunta não encontrada") }
        val ficha = fichaAnamneseRepository.findById(novaResposta.fichaId)
            .orElseThrow { IllegalArgumentException("Ficha não encontrada") }
        val usuario = usuarioRepository.findById(novaResposta.usuarioId)
            .orElseThrow { IllegalArgumentException("Usuário não encontrado") }

        val resposta = Resposta(
            resposta = novaResposta.resposta,
            pergunta = pergunta,
            ficha = ficha,
            usuario = usuario
        )

        val respostaSalva = respostaRepository.save(resposta)

        return RespostaResponseDTO(
            id = respostaSalva.codigoRespostaFichaUsuario!!,
            resposta = respostaSalva.resposta,
            perguntaDescricao = respostaSalva.pergunta.descricao,
            perguntaTipo = respostaSalva.pergunta.tipo,
            usuarioNome = respostaSalva.usuario.nome ?: "",
            usuarioCpf = respostaSalva.usuario.cpf ?: "",
            fichaDataPreenchimento = respostaSalva.ficha.dataPreenchimento.toString()
        )
    }

    fun listarTodasRespostas(): List<RespostaResponseDTO> {
        val respostas = respostaRepository.findAll()
        return respostas.map { resposta ->
            RespostaResponseDTO(
                id = resposta.codigoRespostaFichaUsuario!!,
                resposta = resposta.resposta,
                perguntaDescricao = resposta.pergunta.descricao,
                perguntaTipo = resposta.pergunta.tipo,
                usuarioNome = resposta.usuario.nome ?: "",
                usuarioCpf = resposta.usuario.cpf ?: "",
                fichaDataPreenchimento = resposta.ficha.dataPreenchimento.toString()
            )
        }
    }

    fun filtrarPorCpf(cpf: String): List<RespostaFilteredDTO> {
        val respostas = respostaRepository.findByUsuarioCpf(cpf)
        return respostas.map { resposta ->
            RespostaFilteredDTO(
                resposta = resposta.resposta,
                nomeUsuario = resposta.usuario.nome ?: "",
                cpfUsuario = resposta.usuario.cpf ?: "",
                dataPreenchimentoFicha = resposta.ficha.dataPreenchimento.toString()
            )
        }
    }

    fun filtrarPorPergunta(descricao: String): List<RespostaFilteredDTO> {
        val respostas = respostaRepository.findByPerguntaDescricao(descricao)
        return respostas.map { resposta ->
            RespostaFilteredDTO(
                resposta = resposta.resposta,
                descricaoPergunta = resposta.pergunta.descricao,
                tipoPergunta = resposta.pergunta.tipo,
                nomeUsuario = resposta.usuario.nome ?: "",
                cpfUsuario = resposta.usuario.cpf ?: "",
                dataPreenchimentoFicha = resposta.ficha.dataPreenchimento.toString()
            )
        }
    }

    fun excluirResposta(id: Int): Boolean {
        val respostaOptional = respostaRepository.findById(id)
        return if (respostaOptional.isPresent) {
            respostaRepository.deleteById(id)
            true
        } else {
            false
        }
    }

    fun filtrarPersonalidade(listaRespostas: RespostaPersonalidade): String {

        val respostas = listaRespostas.respostas.associateBy { it.perguntaId }

        val pergunta1 = respostas[1]?.resposta ?: return "Resposta da pergunta 1 não encontrada"
        val pergunta2 = respostas[2]?.resposta ?: return "Resposta da pergunta 2 não encontrada"
        val pergunta3 = respostas[3]?.resposta ?: return "Resposta da pergunta 3 não encontrada"
        val pergunta4 = respostas[4]?.resposta ?: return "Resposta da pergunta 4 não encontrada"

        val combinacoes = mapOf(
            Quadruple("Cílios", "Volume Fio a Fio", "Ler livros", "Artistica") to "Paciente e Criativa",
            Quadruple("Cílios", "Volume Fio a Fio", "Ouvir música", "Medicinal") to "Meticulosa e Cuidativa",
            Quadruple("Cílios", "Volume Fio a Fio", "Redes sociais", "Tecnologia") to "Detalhista e Tecnológica",
            Quadruple("Cílios", "Volume Fio a Fio", "Séries ou TV", "Outros") to "Calma e Versátil",
            Quadruple("Cílios", "Volume Fox Eyes", "Ler livros", "Artistica") to "Criativa e Artística",
            Quadruple("Cílios", "Volume Fox Eyes", "Ouvir música", "Medicinal") to "Inovadora e Cuidativa",
            Quadruple("Cílios", "Volume Fox Eyes", "Redes sociais", "Tecnologia") to "Expressiva e Tecnológica",
            Quadruple("Cílios", "Volume Fox Eyes", "Séries ou TV", "Outros") to "Original e Versátil",
            Quadruple("Cílios", "Volume Brasileiro", "Ler livros", "Artistica") to "Clássica e Artística",
            Quadruple("Cílios", "Volume Brasileiro", "Ouvir música", "Medicinal") to "Elegante e Cuidativa",
            Quadruple("Cílios", "Volume Brasileiro", "Redes sociais", "Tecnologia") to "Tradicional e Tecnológica",
            Quadruple("Cílios", "Volume Brasileiro", "Séries ou TV", "Outros") to "Discreta e Versátil",
            Quadruple("Cílios", "Volume Russo", "Ler livros", "Artistica") to "Marcante e Artística",
            Quadruple("Cílios", "Volume Russo", "Ouvir música", "Medicinal") to "Destemida e Cuidativa",
            Quadruple("Cílios", "Volume Russo", "Redes sociais", "Tecnologia") to "Confiante e Tecnológica",
            Quadruple("Cílios", "Volume Russo", "Séries ou TV", "Outros") to "Poderosa e Versátil",
            Quadruple("Sombrancelha", "Design + Limpeza", "Ler livros", "Artistica") to "Organizada e Artística",
            Quadruple("Sombrancelha", "Design + Limpeza", "Ouvir música", "Medicinal") to "Sutil e Cuidativa",
            Quadruple("Sombrancelha", "Design + Limpeza", "Redes sociais", "Tecnologia") to "Elegante e Tecnológica",
            Quadruple("Sombrancelha", "Design + Limpeza", "Séries ou TV", "Outros") to "Prática e Versátil",
            Quadruple("Sombrancelha", "Design + Henna", "Ler livros", "Artistica") to "Artística e Criativa",
            Quadruple("Sombrancelha", "Design + Henna", "Ouvir música", "Medicinal") to "Colorida e Cuidativa",
            Quadruple("Sombrancelha", "Design + Henna", "Redes sociais", "Tecnologia") to "Criativa e Tecnológica",
            Quadruple("Sombrancelha", "Design + Henna", "Séries ou TV", "Outros") to "Expressiva e Versátil",
            Quadruple("Sombrancelha", "Design + Coloração", "Ler livros", "Artistica") to "Inovadora e Artística",
            Quadruple("Sombrancelha", "Design + Coloração", "Ouvir música", "Medicinal") to "Vanguardista e Cuidativa",
            Quadruple("Sombrancelha", "Design + Coloração", "Redes sociais", "Tecnologia") to "Modernista e Tecnológica",
            Quadruple("Sombrancelha", "Design + Coloração", "Séries ou TV", "Outros") to "Arrojada e Versátil",
            Quadruple("Sombrancelha", "Brow Lamination", "Ler livros", "Artistica") to "Confiante e Artística",
            Quadruple("Sombrancelha", "Brow Lamination", "Ouvir música", "Medicinal") to "Polida e Cuidativa",
            Quadruple("Sombrancelha", "Brow Lamination", "Redes sociais", "Tecnologia") to "Elegante e Tecnológica",
            Quadruple("Sombrancelha", "Brow Lamination", "Séries ou TV", "Outros") to "Moderna e Versátil"
        )

        val chave = Quadruple(pergunta1, pergunta2, pergunta3, pergunta4)
        val personalidade = combinacoes[chave] ?: "Personalidade Indefinida"

        return personalidade
    }

    data class Quadruple<A, B, C, D>(
        val first: A,
        val second: B,
        val third: C,
        val fourth: D
    )
}

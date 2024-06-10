package sptech.projetojpa1.service

import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import sptech.projetojpa1.dto.resposta.RespostaRequestDTO
import sptech.projetojpa1.dto.resposta.RespostaResponseDTO
import sptech.projetojpa1.dto.resposta.RespostaFilteredDTO
import sptech.projetojpa1.dominio.Resposta
import sptech.projetojpa1.dto.resposta.RespostaPersonalidade
import sptech.projetojpa1.repository.*

@Service
class RespostaService(
    private val respostaRepository: RespostaRepository,
    private val perguntaRepository: PerguntaRepository,
    private val fichaAnamneseRepository: FichaAnamneseRepository,
    private val usuarioRepository: UsuarioRepository,
    private val personalidadeRepository: PersonalidadeRepository
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

    // post do César
    fun filtrarPersonalidade(listaRespostas: RespostaPersonalidade): ResponseEntity<String> {

        val respostas = listaRespostas.respostas.associateBy { it.perguntaId }
        val usuario = listaRespostas.usuarioId

        val pergunta1 = respostas[1]?.resposta ?: return ResponseEntity.status(204).body("Resposta da pergunta 1 não encontrada")
        val pergunta2 = respostas[2]?.resposta ?: return ResponseEntity.status(204).body("Resposta da pergunta 2 não encontrada")
        val pergunta3 = respostas[3]?.resposta ?: return ResponseEntity.status(204).body("Resposta da pergunta 3 não encontrada")
        val pergunta4 = respostas[4]?.resposta ?: return ResponseEntity.status(204).body("Resposta da pergunta 4 não encontrada")

        val combinacoes = mapOf(
            Quadruple("Cílios", "Volume Fio a Fio", "Ler livros", "Artistica") to "Paciente e Criativa",
            Quadruple("Cílios", "Volume Fio a Fio", "Ler livros", "Medicinal") to "Paciente e Cuidativa",
            Quadruple("Cílios", "Volume Fio a Fio", "Ler livros", "Tecnologia") to "Paciente e Tecnológica",
            Quadruple("Cílios", "Volume Fio a Fio", "Ler livros", "Outros") to "Paciente e Versátil",
            Quadruple("Cílios", "Volume Fio a Fio", "Ouvir música", "Artistica") to "Meticulosa e Criativa",
            Quadruple("Cílios", "Volume Fio a Fio", "Ouvir música", "Medicinal") to "Meticulosa e Cuidativa",
            Quadruple("Cílios", "Volume Fio a Fio", "Ouvir música", "Tecnologia") to "Meticulosa e Tecnológica",
            Quadruple("Cílios", "Volume Fio a Fio", "Ouvir música", "Outros") to "Meticulosa e Versátil",
            Quadruple("Cílios", "Volume Fio a Fio", "Redes sociais", "Artistica") to "Detalhista e Criativa",
            Quadruple("Cílios", "Volume Fio a Fio", "Redes sociais", "Medicinal") to "Detalhista e Cuidativa",
            Quadruple("Cílios", "Volume Fio a Fio", "Redes sociais", "Tecnologia") to "Detalhista e Tecnológica",
            Quadruple("Cílios", "Volume Fio a Fio", "Redes sociais", "Outros") to "Detalhista e Versátil",
            Quadruple("Cílios", "Volume Fio a Fio", "Séries ou TV", "Artistica") to "Calma e Criativa",
            Quadruple("Cílios", "Volume Fio a Fio", "Séries ou TV", "Medicinal") to "Calma e Cuidativa",
            Quadruple("Cílios", "Volume Fio a Fio", "Séries ou TV", "Tecnologia") to "Calma e Tecnológica",
            Quadruple("Cílios", "Volume Fio a Fio", "Séries ou TV", "Outros") to "Calma e Versátil",

            Quadruple("Cílios", "Volume Fox Eyes", "Ler livros", "Artistica") to "Criativa e Artística",
            Quadruple("Cílios", "Volume Fox Eyes", "Ler livros", "Medicinal") to "Criativa e Cuidativa",
            Quadruple("Cílios", "Volume Fox Eyes", "Ler livros", "Tecnologia") to "Criativa e Tecnológica",
            Quadruple("Cílios", "Volume Fox Eyes", "Ler livros", "Outros") to "Criativa e Versátil",
            Quadruple("Cílios", "Volume Fox Eyes", "Ouvir música", "Artistica") to "Inovadora e Artística",
            Quadruple("Cílios", "Volume Fox Eyes", "Ouvir música", "Medicinal") to "Inovadora e Cuidativa",
            Quadruple("Cílios", "Volume Fox Eyes", "Ouvir música", "Tecnologia") to "Inovadora e Tecnológica",
            Quadruple("Cílios", "Volume Fox Eyes", "Ouvir música", "Outros") to "Inovadora e Versátil",
            Quadruple("Cílios", "Volume Fox Eyes", "Redes sociais", "Artistica") to "Expressiva e Artística",
            Quadruple("Cílios", "Volume Fox Eyes", "Redes sociais", "Medicinal") to "Expressiva e Cuidativa",
            Quadruple("Cílios", "Volume Fox Eyes", "Redes sociais", "Tecnologia") to "Expressiva e Tecnológica",
            Quadruple("Cílios", "Volume Fox Eyes", "Redes sociais", "Outros") to "Expressiva e Versátil",
            Quadruple("Cílios", "Volume Fox Eyes", "Séries ou TV", "Artistica") to "Original e Artística",
            Quadruple("Cílios", "Volume Fox Eyes", "Séries ou TV", "Medicinal") to "Original e Cuidativa",
            Quadruple("Cílios", "Volume Fox Eyes", "Séries ou TV", "Tecnologia") to "Original e Tecnológica",
            Quadruple("Cílios", "Volume Fox Eyes", "Séries ou TV", "Outros") to "Original e Versátil",

            Quadruple("Cílios", "Volume Brasileiro", "Ler livros", "Artistica") to "Clássica e Artística",
            Quadruple("Cílios", "Volume Brasileiro", "Ler livros", "Medicinal") to "Clássica e Cuidativa",
            Quadruple("Cílios", "Volume Brasileiro", "Ler livros", "Tecnologia") to "Clássica e Tecnológica",
            Quadruple("Cílios", "Volume Brasileiro", "Ler livros", "Outros") to "Clássica e Versátil",
            Quadruple("Cílios", "Volume Brasileiro", "Ouvir música", "Artistica") to "Elegante e Artística",
            Quadruple("Cílios", "Volume Brasileiro", "Ouvir música", "Medicinal") to "Elegante e Cuidativa",
            Quadruple("Cílios", "Volume Brasileiro", "Ouvir música", "Tecnologia") to "Elegante e Tecnológica",
            Quadruple("Cílios", "Volume Brasileiro", "Ouvir música", "Outros") to "Elegante e Versátil",
            Quadruple("Cílios", "Volume Brasileiro", "Redes sociais", "Artistica") to "Tradicional e Artística",
            Quadruple("Cílios", "Volume Brasileiro", "Redes sociais", "Medicinal") to "Tradicional e Cuidativa",
            Quadruple("Cílios", "Volume Brasileiro", "Redes sociais", "Tecnologia") to "Tradicional e Tecnológica",
            Quadruple("Cílios", "Volume Brasileiro", "Redes sociais", "Outros") to "Tradicional e Versátil",
            Quadruple("Cílios", "Volume Brasileiro", "Séries ou TV", "Artistica") to "Discreta e Artística",
            Quadruple("Cílios", "Volume Brasileiro", "Séries ou TV", "Medicinal") to "Discreta e Cuidativa",
            Quadruple("Cílios", "Volume Brasileiro", "Séries ou TV", "Tecnologia") to "Discreta e Tecnológica",
            Quadruple("Cílios", "Volume Brasileiro", "Séries ou TV", "Outros") to "Discreta e Versátil",

            Quadruple("Cílios", "Volume Russo", "Ler livros", "Artistica") to "Marcante e Artística",
            Quadruple("Cílios", "Volume Russo", "Ler livros", "Medicinal") to "Marcante e Cuidativa",
            Quadruple("Cílios", "Volume Russo", "Ler livros", "Tecnologia") to "Marcante e Tecnológica",
            Quadruple("Cílios", "Volume Russo", "Ler livros", "Outros") to "Marcante e Versátil",
            Quadruple("Cílios", "Volume Russo", "Ouvir música", "Artistica") to "Destemida e Artística",
            Quadruple("Cílios", "Volume Russo", "Ouvir música", "Medicinal") to "Destemida e Cuidativa",
            Quadruple("Cílios", "Volume Russo", "Ouvir música", "Tecnologia") to "Destemida e Tecnológica",
            Quadruple("Cílios", "Volume Russo", "Ouvir música", "Outros") to "Destemida e Versátil",
            Quadruple("Cílios", "Volume Russo", "Redes sociais", "Artistica") to "Confiante e Artística",
            Quadruple("Cílios", "Volume Russo", "Redes sociais", "Medicinal") to "Confiante e Cuidativa",
            Quadruple("Cílios", "Volume Russo", "Redes sociais", "Tecnologia") to "Confiante e Tecnológica",
            Quadruple("Cílios", "Volume Russo", "Redes sociais", "Outros") to "Confiante e Versátil",
            Quadruple("Cílios", "Volume Russo", "Séries ou TV", "Artistica") to "Poderosa e Artística",
            Quadruple("Cílios", "Volume Russo", "Séries ou TV", "Medicinal") to "Poderosa e Cuidativa",
            Quadruple("Cílios", "Volume Russo", "Séries ou TV", "Tecnologia") to "Poderosa e Tecnológica",
            Quadruple("Cílios", "Volume Russo", "Séries ou TV", "Outros") to "Poderosa e Versátil",

            Quadruple("Maquiagem", "Opção 1", "Ler livros", "Artistica") to "Sofisticada e Criativa",
            Quadruple("Maquiagem", "Opção 1", "Ler livros", "Medicinal") to "Sofisticada e Cuidativa",
            Quadruple("Maquiagem", "Opção 1", "Ler livros", "Tecnologia") to "Sofisticada e Tecnológica",
            Quadruple("Maquiagem", "Opção 1", "Ler livros", "Outros") to "Sofisticada e Versátil",
            Quadruple("Maquiagem", "Opção 1", "Ouvir música", "Artistica") to "Elegante e Criativa",
            Quadruple("Maquiagem", "Opção 1", "Ouvir música", "Medicinal") to "Elegante e Cuidativa",
            Quadruple("Maquiagem", "Opção 1", "Ouvir música", "Tecnologia") to "Elegante e Tecnológica",
            Quadruple("Maquiagem", "Opção 1", "Ouvir música", "Outros") to "Elegante e Versátil",
            Quadruple("Maquiagem", "Opção 1", "Redes sociais", "Artistica") to "Expressiva e Criativa",
            Quadruple("Maquiagem", "Opção 1", "Redes sociais", "Medicinal") to "Expressiva e Cuidativa",
            Quadruple("Maquiagem", "Opção 1", "Redes sociais", "Tecnologia") to "Expressiva e Tecnológica",
            Quadruple("Maquiagem", "Opção 1", "Redes sociais", "Outros") to "Expressiva e Versátil",
            Quadruple("Maquiagem", "Opção 1", "Séries ou TV", "Artistica") to "Original e Criativa",
            Quadruple("Maquiagem", "Opção 1", "Séries ou TV", "Medicinal") to "Original e Cuidativa",
            Quadruple("Maquiagem", "Opção 1", "Séries ou TV", "Tecnologia") to "Original e Tecnológica",
            Quadruple("Maquiagem", "Opção 1", "Séries ou TV", "Outros") to "Original e Versátil",

            Quadruple("Maquiagem", "Opção 2", "Ler livros", "Artistica") to "Criativa e Sofisticada",
            Quadruple("Maquiagem", "Opção 2", "Ler livros", "Medicinal") to "Cuidativa e Sofisticada",
            Quadruple("Maquiagem", "Opção 2", "Ler livros", "Tecnologia") to "Tecnológica e Sofisticada",
            Quadruple("Maquiagem", "Opção 2", "Ler livros", "Outros") to "Versátil e Sofisticada",
            Quadruple("Maquiagem", "Opção 2", "Ouvir música", "Artistica") to "Criativa e Elegante",
            Quadruple("Maquiagem", "Opção 2", "Ouvir música", "Medicinal") to "Cuidativa e Elegante",
            Quadruple("Maquiagem", "Opção 2", "Ouvir música", "Tecnologia") to "Tecnológica e Elegante",
            Quadruple("Maquiagem", "Opção 2", "Ouvir música", "Outros") to "Versátil e Elegante",
            Quadruple("Maquiagem", "Opção 2", "Redes sociais", "Artistica") to "Criativa e Expressiva",
            Quadruple("Maquiagem", "Opção 2", "Redes sociais", "Medicinal") to "Cuidativa e Expressiva",
            Quadruple("Maquiagem", "Opção 2", "Redes sociais", "Tecnologia") to "Tecnológica e Expressiva",
            Quadruple("Maquiagem", "Opção 2", "Redes sociais", "Outros") to "Versátil e Expressiva",
            Quadruple("Maquiagem", "Opção 2", "Séries ou TV", "Artistica") to "Criativa e Original",
            Quadruple("Maquiagem", "Opção 2", "Séries ou TV", "Medicinal") to "Cuidativa e Original",
            Quadruple("Maquiagem", "Opção 2", "Séries ou TV", "Tecnologia") to "Tecnológica e Original",
            Quadruple("Maquiagem", "Opção 2", "Séries ou TV", "Outros") to "Versátil e Original",

            Quadruple("Maquiagem", "Opção 3", "Ler livros", "Artistica") to "Sofisticada e Criativa",
            Quadruple("Maquiagem", "Opção 3", "Ler livros", "Medicinal") to "Sofisticada e Cuidativa",
            Quadruple("Maquiagem", "Opção 3", "Ler livros", "Tecnologia") to "Sofisticada e Tecnológica",
            Quadruple("Maquiagem", "Opção 3", "Ler livros", "Outros") to "Sofisticada e Versátil",
            Quadruple("Maquiagem", "Opção 3", "Ouvir música", "Artistica") to "Elegante e Criativa",
            Quadruple("Maquiagem", "Opção 3", "Ouvir música", "Medicinal") to "Elegante e Cuidativa",
            Quadruple("Maquiagem", "Opção 3", "Ouvir música", "Tecnologia") to "Elegante e Tecnológica",
            Quadruple("Maquiagem", "Opção 3", "Ouvir música", "Outros") to "Elegante e Versátil",
            Quadruple("Maquiagem", "Opção 3", "Redes sociais", "Artistica") to "Expressiva e Criativa",
            Quadruple("Maquiagem", "Opção 3", "Redes sociais", "Medicinal") to "Expressiva e Cuidativa",
            Quadruple("Maquiagem", "Opção 3", "Redes sociais", "Tecnologia") to "Expressiva e Tecnológica",
            Quadruple("Maquiagem", "Opção 3", "Redes sociais", "Outros") to "Expressiva e Versátil",
            Quadruple("Maquiagem", "Opção 3", "Séries ou TV", "Artistica") to "Original e Criativa",
            Quadruple("Maquiagem", "Opção 3", "Séries ou TV", "Medicinal") to "Original e Cuidativa",
            Quadruple("Maquiagem", "Opção 3", "Séries ou TV", "Tecnologia") to "Original e Tecnológica",
            Quadruple("Maquiagem", "Opção 3", "Séries ou TV", "Outros") to "Original e Versátil",

            Quadruple("Maquiagem", "Opção 4", "Ler livros", "Artistica") to "Criativa e Sofisticada",
            Quadruple("Maquiagem", "Opção 4", "Ler livros", "Medicinal") to "Cuidativa e Sofisticada",
            Quadruple("Maquiagem", "Opção 4", "Ler livros", "Tecnologia") to "Tecnológica e Sofisticada",
            Quadruple("Maquiagem", "Opção 4", "Ler livros", "Outros") to "Versátil e Sofisticada",
            Quadruple("Maquiagem", "Opção 4", "Ouvir música", "Artistica") to "Criativa e Elegante",
            Quadruple("Maquiagem", "Opção 4", "Ouvir música", "Medicinal") to "Cuidativa e Elegante",
            Quadruple("Maquiagem", "Opção 4", "Ouvir música", "Tecnologia") to "Tecnológica e Elegante",
            Quadruple("Maquiagem", "Opção 4", "Ouvir música", "Outros") to "Versátil e Elegante",
            Quadruple("Maquiagem", "Opção 4", "Redes sociais", "Artistica") to "Criativa e Expressiva",
            Quadruple("Maquiagem", "Opção 4", "Redes sociais", "Medicinal") to "Cuidativa e Expressiva",
            Quadruple("Maquiagem", "Opção 4", "Redes sociais", "Tecnologia") to "Tecnológica e Expressiva",
            Quadruple("Maquiagem", "Opção 4", "Redes sociais", "Outros") to "Versátil e Expressiva",
            Quadruple("Maquiagem", "Opção 4", "Séries ou TV", "Artistica") to "Criativa e Original",
            Quadruple("Maquiagem", "Opção 4", "Séries ou TV", "Medicinal") to "Cuidativa e Original",
            Quadruple("Maquiagem", "Opção 4", "Séries ou TV", "Tecnologia") to "Tecnológica e Original",
            Quadruple("Maquiagem", "Opção 4", "Séries ou TV", "Outros") to "Versátil e Original",

            Quadruple("Sombrancelha", "Design + Limpeza", "Ler livros", "Artistica") to "Atenciosa e Criativa",
            Quadruple("Sombrancelha", "Design + Limpeza", "Ler livros", "Medicinal") to "Atenciosa e Cuidativa",
            Quadruple("Sombrancelha", "Design + Limpeza", "Ler livros", "Tecnologia") to "Atenciosa e Tecnológica",
            Quadruple("Sombrancelha", "Design + Limpeza", "Ler livros", "Outros") to "Atenciosa e Versátil",
            Quadruple("Sombrancelha", "Design + Limpeza", "Ouvir música", "Artistica") to "Cuidadosa e Criativa",
            Quadruple("Sombrancelha", "Design + Limpeza", "Ouvir música", "Medicinal") to "Cuidadosa e Cuidativa",
            Quadruple("Sombrancelha", "Design + Limpeza", "Ouvir música", "Tecnologia") to "Cuidadosa e Tecnológica",
            Quadruple("Sombrancelha", "Design + Limpeza", "Ouvir música", "Outros") to "Cuidadosa e Versátil",
            Quadruple("Sombrancelha", "Design + Limpeza", "Redes sociais", "Artistica") to "Determinada e Criativa",
            Quadruple("Sombrancelha", "Design + Limpeza", "Redes sociais", "Medicinal") to "Determinada e Cuidativa",
            Quadruple("Sombrancelha", "Design + Limpeza", "Redes sociais", "Tecnologia") to "Determinada e Tecnológica",
            Quadruple("Sombrancelha", "Design + Limpeza", "Redes sociais", "Outros") to "Determinada e Versátil",
            Quadruple("Sombrancelha", "Design + Limpeza", "Séries ou TV", "Artistica") to "Pacienciosa e Criativa",
            Quadruple("Sombrancelha", "Design + Limpeza", "Séries ou TV", "Medicinal") to "Pacienciosa e Cuidativa",
            Quadruple("Sombrancelha", "Design + Limpeza", "Séries ou TV", "Tecnologia") to "Pacienciosa e Tecnológica",
            Quadruple("Sombrancelha", "Design + Limpeza", "Séries ou TV", "Outros") to "Pacienciosa e Versátil",

            Quadruple("Sombrancelha", "Design + Henna", "Ler livros", "Artistica") to "Artística e Criativa",
            Quadruple("Sombrancelha", "Design + Henna", "Ler livros", "Medicinal") to "Artística e Cuidativa",
            Quadruple("Sombrancelha", "Design + Henna", "Ler livros", "Tecnologia") to "Artística e Tecnológica",
            Quadruple("Sombrancelha", "Design + Henna", "Ler livros", "Outros") to "Artística e Versátil",
            Quadruple("Sombrancelha", "Design + Henna", "Ouvir música", "Artistica") to "Criativa e Cuidadosa",
            Quadruple("Sombrancelha", "Design + Henna", "Ouvir música", "Medicinal") to "Cuidativa e Cuidadosa",
            Quadruple("Sombrancelha", "Design + Henna", "Ouvir música", "Tecnologia") to "Tecnológica e Cuidadosa",
            Quadruple("Sombrancelha", "Design + Henna", "Ouvir música", "Outros") to "Versátil e Cuidadosa",
            Quadruple("Sombrancelha", "Design + Henna", "Redes sociais", "Artistica") to "Criativa e Determinada",
            Quadruple("Sombrancelha", "Design + Henna", "Redes sociais", "Medicinal") to "Cuidativa e Determinada",
            Quadruple("Sombrancelha", "Design + Henna", "Redes sociais", "Tecnologia") to "Tecnológica e Determinada",
            Quadruple("Sombrancelha", "Design + Henna", "Redes sociais", "Outros") to "Versátil e Determinada",
            Quadruple("Sombrancelha", "Design + Henna", "Séries ou TV", "Artistica") to "Criativa e Pacienciosa",
            Quadruple("Sombrancelha", "Design + Henna", "Séries ou TV", "Medicinal") to "Cuidativa e Pacienciosa",
            Quadruple("Sombrancelha", "Design + Henna", "Séries ou TV", "Tecnologia") to "Tecnológica e Pacienciosa",
            Quadruple("Sombrancelha", "Design + Henna", "Séries ou TV", "Outros") to "Versátil e Pacienciosa",

            Quadruple("Sombrancelha", "Design + Coloração", "Ler livros", "Artistica") to "Colorida e Criativa",
            Quadruple("Sombrancelha", "Design + Coloração", "Ler livros", "Medicinal") to "Colorida e Cuidativa",
            Quadruple("Sombrancelha", "Design + Coloração", "Ler livros", "Tecnologia") to "Colorida e Tecnológica",
            Quadruple("Sombrancelha", "Design + Coloração", "Ler livros", "Outros") to "Colorida e Versátil",
            Quadruple("Sombrancelha", "Design + Coloração", "Ouvir música", "Artistica") to "Vibrante e Criativa",
            Quadruple("Sombrancelha", "Design + Coloração", "Ouvir música", "Medicinal") to "Vibrante e Cuidativa",
            Quadruple("Sombrancelha", "Design + Coloração", "Ouvir música", "Tecnologia") to "Vibrante e Tecnológica",
            Quadruple("Sombrancelha", "Design + Coloração", "Ouvir música", "Outros") to "Vibrante e Versátil",
            Quadruple("Sombrancelha", "Design + Coloração", "Redes sociais", "Artistica") to "Radiante e Criativa",
            Quadruple("Sombrancelha", "Design + Coloração", "Redes sociais", "Medicinal") to "Radiante e Cuidativa",
            Quadruple("Sombrancelha", "Design + Coloração", "Redes sociais", "Tecnologia") to "Radiante e Tecnológica",
            Quadruple("Sombrancelha", "Design + Coloração", "Redes sociais", "Outros") to "Radiante e Versátil",
            Quadruple("Sombrancelha", "Design + Coloração", "Séries ou TV", "Artistica") to "Colorida e Pacienciosa",
            Quadruple("Sombrancelha", "Design + Coloração", "Séries ou TV", "Medicinal") to "Colorida e Pacienciosa",
            Quadruple("Sombrancelha", "Design + Coloração", "Séries ou TV", "Tecnologia") to "Colorida e Pacienciosa",
            Quadruple("Sombrancelha", "Design + Coloração", "Séries ou TV", "Outros") to "Colorida e Versátil",

            Quadruple("Sombrancelha", "Brow Lamination", "Ler livros", "Artistica") to "Chique e Criativa",
            Quadruple("Sombrancelha", "Brow Lamination", "Ler livros", "Medicinal") to "Chique e Cuidativa",
            Quadruple("Sombrancelha", "Brow Lamination", "Ler livros", "Tecnologia") to "Chique e Tecnológica",
            Quadruple("Sombrancelha", "Brow Lamination", "Ler livros", "Outros") to "Chique e Versátil",
            Quadruple("Sombrancelha", "Brow Lamination", "Ouvir música", "Artistica") to "Estilosa e Criativa",
            Quadruple("Sombrancelha", "Brow Lamination", "Ouvir música", "Medicinal") to "Estilosa e Cuidativa",
            Quadruple("Sombrancelha", "Brow Lamination", "Ouvir música", "Tecnologia") to "Estilosa e Tecnológica",
            Quadruple("Sombrancelha", "Brow Lamination", "Ouvir música", "Outros") to "Estilosa e Versátil",
            Quadruple("Sombrancelha", "Brow Lamination", "Redes sociais", "Artistica") to "Elegante e Criativa",
            Quadruple("Sombrancelha", "Brow Lamination", "Redes sociais", "Medicinal") to "Elegante e Cuidativa",
            Quadruple("Sombrancelha", "Brow Lamination", "Redes sociais", "Tecnologia") to "Elegante e Tecnológica",
            Quadruple("Sombrancelha", "Brow Lamination", "Redes sociais", "Outros") to "Elegante e Versátil",
            Quadruple("Sombrancelha", "Brow Lamination", "Séries ou TV", "Artistica") to "Chique e Pacienciosa",
            Quadruple("Sombrancelha", "Brow Lamination", "Séries ou TV", "Medicinal") to "Chique e Pacienciosa",
            Quadruple("Sombrancelha", "Brow Lamination", "Séries ou TV", "Tecnologia") to "Chique e Pacienciosa",
            Quadruple("Sombrancelha", "Brow Lamination", "Séries ou TV", "Outros") to "Chique e Versátil",

            Quadruple("Sombrancelha", "Micropigmentação", "Ler livros", "Artistica") to "Intensa e Criativa",
            Quadruple("Sombrancelha", "Micropigmentação", "Ler livros", "Medicinal") to "Intensa e Cuidativa",
            Quadruple("Sombrancelha", "Micropigmentação", "Ler livros", "Tecnologia") to "Intensa e Tecnológica",
            Quadruple("Sombrancelha", "Micropigmentação", "Ler livros", "Outros") to "Intensa e Versátil",
            Quadruple("Sombrancelha", "Micropigmentação", "Ouvir música", "Artistica") to "Profunda e Criativa",
            Quadruple("Sombrancelha", "Micropigmentação", "Ouvir música", "Medicinal") to "Profunda e Cuidativa",
            Quadruple("Sombrancelha", "Micropigmentação", "Ouvir música", "Tecnologia") to "Profunda e Tecnológica",
            Quadruple("Sombrancelha", "Micropigmentação", "Ouvir música", "Outros") to "Profunda e Versátil",
            Quadruple("Sombrancelha", "Micropigmentação", "Redes sociais", "Artistica") to "Imaginativa e Criativa",
            Quadruple("Sombrancelha", "Micropigmentação", "Redes sociais", "Medicinal") to "Imaginativa e Cuidativa",
            Quadruple("Sombrancelha", "Micropigmentação", "Redes sociais", "Tecnologia") to "Imaginativa e Tecnológica",
            Quadruple("Sombrancelha", "Micropigmentação", "Redes sociais", "Outros") to "Imaginativa e Versátil",
            Quadruple("Sombrancelha", "Micropigmentação", "Séries ou TV", "Artistica") to "Intensa e Pacienciosa",
            Quadruple("Sombrancelha", "Micropigmentação", "Séries ou TV", "Medicinal") to "Intensa e Pacienciosa",
            Quadruple("Sombrancelha", "Micropigmentação", "Séries ou TV", "Tecnologia") to "Intensa e Pacienciosa",
            Quadruple("Sombrancelha", "Micropigmentação", "Séries ou TV", "Outros") to "Intensa e Versátil",

            Quadruple("Sombrancelha", "Correção Micropigmentação", "Ler livros", "Artistica") to "Inovadora e Criativa",
            Quadruple("Sombrancelha", "Correção Micropigmentação", "Ler livros", "Medicinal") to "Inovadora e Cuidativa",
            Quadruple("Sombrancelha", "Correção Micropigmentação", "Ler livros", "Tecnologia") to "Inovadora e Tecnológica",
            Quadruple("Sombrancelha", "Correção Micropigmentação", "Ler livros", "Outros") to "Inovadora e Versátil",
            Quadruple("Sombrancelha", "Correção Micropigmentação", "Ouvir música", "Artistica") to "Determinda e Criativa",
            Quadruple("Sombrancelha", "Correção Micropigmentação", "Ouvir música", "Medicinal") to "Determinda e Cuidativa",
            Quadruple("Sombrancelha", "Correção Micropigmentação", "Ouvir música", "Tecnologia") to "Determinda e Tecnológica",
            Quadruple("Sombrancelha", "Correção Micropigmentação", "Ouvir música", "Outros") to "Determinda e Versátil",
            Quadruple("Sombrancelha", "Correção Micropigmentação", "Redes sociais", "Artistica") to "Cuidadosa e Criativa",
            Quadruple("Sombrancelha", "Correção Micropigmentação", "Redes sociais", "Medicinal") to "Cuidadosa e Cuidativa",
            Quadruple("Sombrancelha", "Correção Micropigmentação", "Redes sociais", "Tecnologia") to "Cuidadosa e Tecnológica",
            Quadruple("Sombrancelha", "Correção Micropigmentação", "Redes sociais", "Outros") to "Cuidadosa e Versátil",
            Quadruple("Sombrancelha", "Correção Micropigmentação", "Séries ou TV", "Artistica") to "Atenciosa e Criativa",
            Quadruple("Sombrancelha", "Correção Micropigmentação", "Séries ou TV", "Medicinal") to "Atenciosa e Cuidativa",
            Quadruple("Sombrancelha", "Correção Micropigmentação", "Séries ou TV", "Tecnologia") to "Atenciosa e Tecnológica",
            Quadruple("Sombrancelha", "Correção Micropigmentação", "Séries ou TV", "Outros") to "Atenciosa e Versátil"
        )

        val chave = Quadruple(pergunta1, pergunta2, pergunta3, pergunta4)
        val personalidadeDefinida = combinacoes[chave] ?: "Personalidade Indefinida"

        val idPersonalidade = personalidadeRepository.findByPersonalidade(personalidadeDefinida)

        usuarioRepository.atualizarPersonalidadeDoUsuario(usuario, idPersonalidade)



        return ResponseEntity.status(200).body(personalidadeDefinida)
    }

    data class Quadruple<A, B, C, D>(
        val first: A,
        val second: B,
        val third: C,
        val fourth: D
    )

    // delete do César
    fun deletarPersonalidade(listaRespostas: RespostaPersonalidade): ResponseEntity<String> {
        val usuario = listaRespostas.usuarioId

        usuarioRepository.deletarPersonalidadeDoUsuario(usuario)

        return ResponseEntity.status(200).body("Deletado com sucesso!")
    }
}

package sptech.projetojpa1.service

import jakarta.transaction.Transactional
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import sptech.projetojpa1.domain.Usuario
import sptech.projetojpa1.domain.usuario.Cliente
import sptech.projetojpa1.domain.usuario.Profissional
import sptech.projetojpa1.dto.usuario.*
import sptech.projetojpa1.repository.*
import java.util.*

@Service
class UsuarioService(
    @Autowired private val usuarioRepository: UsuarioRepository,
    @Autowired private val nivelAcessoRepository: NivelAcessoRepository,
    @Autowired private val enderecoRepository: EnderecoRepository,
    @Autowired private val empresaRepository: EmpresaRepository,
    @Autowired private val fichaAnamneseRepository: FichaAnamneseRepository,
    @Autowired private val respostaRepository: RespostaRepository,
    @Autowired private val feedbackRepository: FeedbackRepository,
    @Autowired private val agendamentoRepository: AgendamentoRepository,
) {
    fun salvarUsuario(dto: UsuarioRequest): Usuario {
        val usuario: Usuario = if (dto.nivelAcessoId == 1) {
            Cliente(
                codigo = dto.codigo,
                nome = dto.nome,
                email = dto.email,
                senha = dto.senha,
                instagram = dto.instagram,
                cpf = dto.cpf,
                telefone = dto.telefone,
                dataNasc = dto.dataNasc,
                genero = dto.genero,
                indicacao = dto.indicacao,
                foto = null,
                status = dto.status,
                nivelAcesso = dto.nivelAcessoId?.let { nivelAcessoRepository.findById(it).orElse(null) },
                endereco = dto.enderecoId?.let { enderecoRepository.findById(it).orElse(null) },
                empresa = dto.empresaId?.let { empresaRepository.findById(it).orElse(null) },
                fichaAnamnese = dto.fichaAnamneseId?.let { fichaAnamneseRepository.findById(it).orElse(null) }
            )
        } else {
            Profissional(
                codigo = dto.codigo,
                nome = dto.nome,
                email = dto.email,
                senha = dto.senha,
                instagram = dto.instagram,
                cpf = dto.cpf,
                telefone = dto.telefone,
                dataNasc = dto.dataNasc,
                genero = dto.genero,
                indicacao = dto.indicacao,
                foto = null,
                status = dto.status,
                nivelAcesso = dto.nivelAcessoId?.let { nivelAcessoRepository.findById(it).orElse(null) },
                endereco = dto.enderecoId?.let { enderecoRepository.findById(it).orElse(null) },
                empresa = dto.empresaId?.let { empresaRepository.findById(it).orElse(null) },
                especialidade = ""
            )
        }

        return usuarioRepository.save(usuario)
    }


    fun fazerLogin(request: UsuarioLoginRequest): UsuarioLoginResponse? {
        val usuario = usuarioRepository.findByEmailIgnoreCase(request.email)
        return if (usuario != null && usuario.senha.equals(request.senha, ignoreCase = true)) {
            usuario.status = true
            usuarioRepository.save(usuario)
            UsuarioLoginResponse(
                mensagem = "Login realizado com sucesso.",
                nome = usuario.nome ?: "",
                email = usuario.email ?: "",
                cpf = usuario.cpf ?: "",
                instagram = usuario.instagram ?: "",
                empresa = usuario.empresa
            )
        } else {
            null
        }
    }

    fun fazerLogoffPorId(id: Int): String {
        val usuario = usuarioRepository.findById(id).orElse(null)
        return if (usuario != null) {
            usuario.status = false
            usuarioRepository.save(usuario)
            "Logoff do(a) ${usuario.nome} realizado com sucesso."
        } else {
            "Usuário com ID $id não está cadastrado em nosso sistema, verifique a credencial e tente novamente."
        }
    }

    fun atualizarUsuarioPorCpf(cpf: String, dto: UsuarioAtualizacaoRequest): Usuario? {
        val usuario = usuarioRepository.findByCpf(cpf) ?: return null
        usuario.apply {
            nome = dto.nome ?: nome
            email = dto.email ?: email
//            senha = dto.senha ?: senha
            instagram = dto.instagram ?: instagram
            dataNasc = dto.dataNasc ?: dataNasc
            telefone = dto.telefone ?: telefone
            genero = dto.genero ?: genero
            indicacao = dto.indicacao ?: indicacao
        }
        return usuarioRepository.save(usuario)
    }

    @Transactional
    fun deletarUsuarioPorId(id: Int): Boolean {
        val usuario = usuarioRepository.findById(id).orElse(null) ?: return false

        // Excluindo Feedbacks relacionados ao Usuário
        feedbackRepository.deleteAllByUsuario(usuario)

        // Excluindo Agendamentos relacionados ao Usuário
        agendamentoRepository.deleteAllByUsuario(usuario)

        // Excluindo Respostas relacionadas ao Usuário
        respostaRepository.deleteAllByUsuario(usuario)

        // Excluindo outras entidades associadas (se necessário)
        // Adicione aqui outras exclusões necessárias, seguindo o padrão acima

        // Por fim, excluir o próprio Usuário
        usuarioRepository.delete(usuario)
        return true
    }


    fun listarUsuariosAtivos(): List<Usuario> = usuarioRepository.findByStatusTrue()

    fun listarTodosUsuarios(): List<UsuarioResponseDTO> {
        val usuarios = usuarioRepository.findAll()
        return usuarios.map { usuario ->
            UsuarioResponseDTO(
                idUsuario = usuario.codigo,
                nome = usuario.nome,
                dataNasc = usuario.dataNasc,
            )
        }
    }

    fun atualizarFotoUsuario(cpf: String, imagem: ByteArray): Usuario? {
        val usuario = usuarioRepository.findByCpf(cpf) ?: return null
        usuario.foto = imagem
        return usuarioRepository.save(usuario)
    }

    fun getFoto(codigo: Int): ByteArray? = usuarioRepository.findFotoByCodigo(codigo)

    fun getUsuariosByNivelAcesso(codigo: Int): List<Usuario> {
        val nivelAcesso = nivelAcessoRepository.findById(codigo).orElse(null)
        return if (nivelAcesso != null) {
            usuarioRepository.findByStatusTrueAndNivelAcesso(nivelAcesso)
        } else {
            emptyList()
        }
    }

    fun getByStatus(status: Boolean): List<Usuario> = usuarioRepository.findByStatus(status)

    fun getIndicacoesFontes(): List<Usuario> = usuarioRepository.findClientesPorOrigem()

    fun getClientesAtivos(): Int {
        return usuarioRepository.findClientesAtivos()
    }

    fun findTop3Indicacoes(): List<String> {
        return usuarioRepository.findTop3Indicacoes()
    }

    fun buscarNumeroIndicacoes(): List<Int> {
        return usuarioRepository.buscarNumerosDivulgacao()
    }

    fun getClientesInativos(): Int {
        return usuarioRepository.findClientesInativos()
    }

    fun getClientesFidelizadosUltimosTresMeses(): Int {
        return usuarioRepository.findClientesFidelizadosUltimosTresMeses()
    }

    fun atualizarStatusParaInativo(cpf: String): Usuario? {
        val usuario = usuarioRepository.findByCpf(cpf)
        return if (usuario != null) {
            println("Usuário encontrado: $usuario")
            usuario.status = false
            usuarioRepository.save(usuario)
            println("Status atualizado para: ${usuario.status}")
            usuario
        } else {
            println("Usuário não encontrado para o CPF: $cpf")
            null
        }
    }

    fun atualizarStatusParaAtivo(cpf: String): Usuario? {
        val usuario = usuarioRepository.findByCpf(cpf)
        return if (usuario != null) {
            println("Usuário encontrado: $usuario")
            usuario.status = true
            usuarioRepository.save(usuario)
            println("Status atualizado para: ${usuario.status}")
            usuario
        } else {
            println("Usuário não encontrado para o CPF: $cpf")
            null
        }
    }

//    fun atualizarEndereco(cpf: String, dto: EnderecoAtualizacaoRequest): Endereco? {
//        val usuario = usuarioRepository.findByCpf(cpf)
//            ?: return null // Retorna null se o usuário não for encontrado
//
//        val endereco = usuario.endereco
//            ?: return null // Retorna null se o endereço não for encontrado
//
//        // Atualiza os campos do endereço apenas se eles não forem nulos na requisição
//        dto.logradouro?.let { endereco.logradouro = it }
//        dto.cep?.let { endereco.cep = it }
//        dto.numero?.let { endereco.numero = it }
//        dto.bairro?.let { endereco.bairro = it }
//        dto.cidade?.let { endereco.cidade = it }
//        dto.estado?.let { endereco.estado = it }
//
//        // Atualiza ou cria o complemento
//        dto.complemento?.let { complementoDescricao ->
//            val complementoExistente = complementoRepository.findByEnderecoId(endereco.codigo!!)
//                ?: Complemento(codigo = null, complemento = complementoDescricao, endereco = endereco)
//            complementoExistente.complemento = complementoDescricao
//            complementoRepository.save(complementoExistente)
//        }
//
//        return enderecoRepository.save(endereco) // Salva o endereço atualizado
//    }


    fun getClientesConcluidosUltimos5Meses(): List<Int> {
        return usuarioRepository.findClientesConcluidos5Meses()
    }

    fun getClientesFidelizadosUltimos5Meses(): List<Int> {
        return usuarioRepository.findClientesFidelizados5Meses()
    }

    fun getByCpf(cpf: String): Usuario? = usuarioRepository.findByCpf(cpf)
}
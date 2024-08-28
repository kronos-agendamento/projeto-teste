package sptech.projetojpa1.service

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import sptech.projetojpa1.dominio.Cliente
import sptech.projetojpa1.dominio.Profissional
import sptech.projetojpa1.dominio.Usuario
import sptech.projetojpa1.dto.usuario.UsuarioAtualizacaoRequest
import sptech.projetojpa1.dto.usuario.UsuarioLoginRequest
import sptech.projetojpa1.dto.usuario.UsuarioLoginResponse
import sptech.projetojpa1.dto.usuario.UsuarioRequest
import sptech.projetojpa1.repository.*

@Service
class UsuarioService(
    @Autowired private val usuarioRepository: UsuarioRepository,
    @Autowired private val nivelAcessoRepository: NivelAcessoRepository,
    @Autowired private val enderecoRepository: EnderecoRepository,
    @Autowired private val empresaRepository: EmpresaRepository,
    @Autowired private val fichaAnamneseRepository: FichaAnamneseRepository,
    @Autowired private val respostaRepository: RespostaRepository
) {

    fun salvarUsuario(dto: UsuarioRequest): Usuario {
        val usuario: Usuario = if (dto.nivelAcessoId == 1) {
            Cliente(
                codigo = dto.codigo,
                nome = dto.nome,
                email = dto.email,
                instagram = dto.instagram
            ) as Usuario
        } else {
            Profissional(
                codigo = dto.codigo,
                nome = dto.nome,
                email = dto.email,
                instagram = dto.instagram,
                especialidade = "Especialidade Padrão"
            ) as Usuario
        }

        usuario.senha = dto.senha
        usuario.cpf = dto.cpf
        usuario.telefone = dto.telefone
        usuario.telefoneEmergencial = dto.telefoneEmergencial
        usuario.dataNasc = dto.dataNasc
        usuario.genero = dto.genero
        usuario.indicacao = dto.indicacao
        usuario.foto = null
        usuario.status = dto.status
        usuario.nivelAcesso = dto.nivelAcessoId?.let { nivelAcessoRepository.findById(it).orElse(null) }
        usuario.endereco = dto.enderecoId?.let { enderecoRepository.findById(it).orElse(null) }
        usuario.empresa = dto.empresaId?.let { empresaRepository.findById(it).orElse(null) }
        usuario.fichaAnamnese = dto.fichaAnamneseId?.let { fichaAnamneseRepository.findById(it).orElse(null) }

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
                cpf = usuario.cpf ?: ""
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
            senha = dto.senha ?: senha
            instagram = dto.instagram ?: instagram
            dataNasc = dto.dataNasc ?: dataNasc
            telefone = dto.telefone ?: telefone
            telefoneEmergencial = dto.telefoneEmergencial ?: telefoneEmergencial
            genero = dto.genero ?: genero
            indicacao = dto.indicacao ?: indicacao
            nivelAcesso = dto.nivelAcessoId?.let { nivelAcessoRepository.findById(it).orElse(nivelAcesso) }
            endereco = dto.enderecoId?.let { enderecoRepository.findById(it).orElse(endereco) }
            empresa = dto.empresaId?.let { empresaRepository.findById(it).orElse(empresa) }
            fichaAnamnese = dto.fichaAnamneseId?.let { fichaAnamneseRepository.findById(it).orElse(fichaAnamnese) }
        }
        return usuarioRepository.save(usuario)
    }

    fun deletarUsuarioPorId(id: Int): Boolean {
        val usuario = usuarioRepository.findById(id).orElse(null) ?: return false
        usuarioRepository.delete(usuario)
        return true
    }

    fun listarUsuariosAtivos(): List<Usuario> = usuarioRepository.findByStatusTrue()

    fun listarTodosUsuarios(): List<Usuario> = usuarioRepository.findAll()

    fun buscarUsuarioPorCodigo(codigo: Int): Usuario? = usuarioRepository.findById(codigo).orElse(null)

    fun atualizarFotoUsuario(cpf: String, imagem: ByteArray): Usuario? {
        val usuario = usuarioRepository.findByCpf(cpf) ?: return null
        usuario.foto = imagem
        return usuarioRepository.save(usuario)
    }

    fun getFoto(codigo: Int): ByteArray? = usuarioRepository.findFotoByCodigo(codigo)

    fun getById(id: Int): Usuario? = usuarioRepository.findById(id).orElse(null)

    fun getByNomeContains(nome: String): List<Usuario> = usuarioRepository.findByNomeContainsIgnoreCase(nome)

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

    fun getByCpf(cpf: String): Usuario? = usuarioRepository.findByCpf(cpf)
}
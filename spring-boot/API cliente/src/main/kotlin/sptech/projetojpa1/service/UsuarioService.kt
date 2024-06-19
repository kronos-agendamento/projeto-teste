package sptech.projetojpa1.service

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
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
        val usuario = Usuario(
            codigo = dto.codigo,
            nome = dto.nome,
            email = dto.email,
            senha = dto.senha,
            instagram = dto.instagram,
            cpf = dto.cpf,
            telefone = dto.telefone,
            telefoneEmergencial = dto.telefoneEmergencial,
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
                email = usuario.email ?: ""
            )
        } else {
            null
        }
    }


    fun fazerLogoff(cpf: String): String {
        val usuario = usuarioRepository.findByCpf(cpf)
        return if (usuario != null) {
            usuario.status = false
            usuarioRepository.save(usuario)
            "Logoff do(a) ${usuario.nome} realizado com sucesso."
        } else {
            "Esse CPF não está cadastrado em nosso sistema, verifique a credencial e tente novamente."
        }
    }

    fun atualizarUsuario(cpf: String, dto: UsuarioAtualizacaoRequest): Usuario? {
        val usuario = usuarioRepository.findByCpf(cpf) ?: return null
        usuario.apply {
            nome = dto.nome ?: nome
            email = dto.email ?: email
            senha = dto.senha ?: senha
            instagram = dto.instagram ?: instagram
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

    fun deletarUsuario(cpf: String): Boolean {
        val usuario = usuarioRepository.findByCpf(cpf) ?: return false
        usuarioRepository.delete(usuario)
        return true
    }

    fun listarUsuariosAtivos(): List<Usuario> = usuarioRepository.findByStatusTrue()

    fun listarTodosUsuarios(): List<Usuario> = usuarioRepository.findAll()

    fun buscarUsuarioPorCodigo(codigo: Int): Usuario? = usuarioRepository.findById(codigo).orElse(null)


    fun atualizarFotoUsuario(codigo: Int, imagem: ByteArray): Usuario? {
        val usuario = usuarioRepository.findById(codigo).orElse(null) ?: return null
        usuario.foto = imagem
        return usuarioRepository.save(usuario)
    }

    fun getFoto(codigo: Int): ByteArray? = usuarioRepository.findFotoByCodigo(codigo)


    fun getByCPF(cpf: String): Usuario? = usuarioRepository.findByCpf(cpf)

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

    fun getClientesAtivos(): Double {
        return usuarioRepository.findClientesAtivos()
    }

    fun getClientesInativos(): Double {
        return usuarioRepository.findClientesInativos()
    }

    fun getClientesFidelizadosUltimosTresMeses(): Double {
        return usuarioRepository.findClientesFidelizadosUltimosTresMeses()
    }
}
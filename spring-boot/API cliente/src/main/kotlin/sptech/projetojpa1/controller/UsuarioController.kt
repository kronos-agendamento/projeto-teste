package sptech.projetojpa1.controller

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import sptech.projetojpa1.dominio.*
import sptech.projetojpa1.repository.EnderecoRepository
import sptech.projetojpa1.repository.NivelAcessoRepository
import sptech.projetojpa1.repository.UsuarioRepository
import sptech.projetojpa1.repository.FichaAnamneseRepository
import sptech.projetojpa1.repository.RespostaRepository
import java.time.LocalDateTime
import java.util.*

@RestController
@RequestMapping("/usuarios")
class UsuarioController(
    private val repository: UsuarioRepository,
    private val nivelAcessoRepository: NivelAcessoRepository,
    private val enderecoRepository: EnderecoRepository,
    private val fichaAnamneseRepository: FichaAnamneseRepository,
    private val respostaRepository: RespostaRepository
) {

    @PostMapping
    fun cadastrarUsuario(@RequestBody novoUsuario: Usuario): ResponseEntity<Usuario> {
        val usuarioSalvo = repository.save(novoUsuario)
        return ResponseEntity.ok(usuarioSalvo)
    }

    @GetMapping
    fun listarUsuariosAtivos(): ResponseEntity<List<Usuario>> {
        val usuariosAtivos = repository.findByStatusTrue()
        return if (usuariosAtivos.isNotEmpty()) {
            ResponseEntity.ok(usuariosAtivos)
        } else {
            ResponseEntity.noContent().build()
        }
    }

    @GetMapping("/todos")
    fun listarTodosUsuarios(): ResponseEntity<List<Usuario>> {
        val todosUsuarios = repository.findAll()
        return if (todosUsuarios.isNotEmpty()) {
            ResponseEntity.ok(todosUsuarios)
        } else {
            ResponseEntity.noContent().build()
        }
    }

    @GetMapping("/{codigo}")
    fun buscarUsuarioPorCodigo(@PathVariable codigo: Int): ResponseEntity<Usuario> {
        val usuario = repository.findById(codigo)
        return usuario.map {
            ResponseEntity.ok(it)
        }.orElse(ResponseEntity.notFound().build())
    }

    @PatchMapping("/desativar/{codigo}")
    fun desativarUsuario(@PathVariable codigo: Int): ResponseEntity<Void> {
        return alterarStatusUsuario(codigo, false)
    }

    @PatchMapping("/ativar/{codigo}")
    fun ativarUsuario(@PathVariable codigo: Int): ResponseEntity<Void> {
        return alterarStatusUsuario(codigo, true)
    }

    private fun alterarStatusUsuario(codigo: Int, status: Boolean): ResponseEntity<Void> {
        val usuarioOptional: Optional<Usuario> = repository.findById(codigo)
        return usuarioOptional.map { usuario ->
            usuario.status = status
            repository.save(usuario)
            ResponseEntity.noContent().build<Void>()
        }.orElse(ResponseEntity.notFound().build())
    }

    @PatchMapping("/imagem/{codigo}")
    fun atualizarFotoUsuario(
        @PathVariable codigo: Int, @RequestBody imagem: ByteArray
    ): ResponseEntity<Void> {
        val usuarioOptional: Optional<Usuario> = repository.findById(codigo)
        return usuarioOptional.map { usuario ->
            usuario.foto = imagem
            repository.save(usuario)
            ResponseEntity.noContent().build<Void>()
        }.orElse(ResponseEntity.notFound().build())
    }

    @GetMapping("/imagem/{codigo}")
    fun resgatarImagemUsuario(@PathVariable codigo: Int): ResponseEntity<ByteArray> {
        val usuarioOptional = repository.findById(codigo)
        return usuarioOptional.map { usuario ->
            usuario.foto?.let {
                ResponseEntity.ok(it)
            } ?: ResponseEntity.noContent().build()
        }.orElse(ResponseEntity.notFound().build())
    }

    @GetMapping("/cpf/{cpf}")
    fun getByCPF(@PathVariable cpf: String): ResponseEntity<Usuario> {
        val usuario = repository.findByCpf(cpf)
        return usuario?.let {
            ResponseEntity.ok(it)
        } ?: ResponseEntity.notFound().build()
    }

    @GetMapping("/nome/{nome}")
    fun getByNomeContains(@PathVariable nome: String): ResponseEntity<List<Usuario>> {
        val usuarios = repository.findByNomeContaining(nome)
        return if (usuarios.isNotEmpty()) {
            ResponseEntity.ok(usuarios)
        } else {
            ResponseEntity.noContent().build()
        }
    }

    @GetMapping("/nivelAcesso/{codigo}")
    fun getUsuariosByNivelAcesso(@PathVariable codigo: Int): ResponseEntity<List<Usuario>> {
        val nivelAcesso = nivelAcessoRepository.findById(codigo)
        return nivelAcesso.map { nivel ->
            val lista = repository.findByStatusTrueAndNivelAcesso(nivel)
            if (lista.isNotEmpty()) {
                ResponseEntity.ok(lista)
            } else {
                ResponseEntity.noContent().build()
            }
        }.orElse(ResponseEntity.notFound().build())
    }


    @GetMapping("/status/{status}")
    fun getByStatus(@PathVariable status: Boolean): ResponseEntity<List<Usuario>> {
        val usuarios = repository.findByStatus(status)
        return if (usuarios.isNotEmpty()) {
            ResponseEntity.ok(usuarios)
        } else {
            ResponseEntity.noContent().build()
        }
    }

    @PatchMapping("/ficha/{cpf}")
    fun patchRespostasFicha(
        @PathVariable cpf: String, @RequestBody respostas: List<Resposta>
    ): ResponseEntity<Void> {
        val usuario = repository.findByCpf(cpf)
        return if (usuario != null) {
            // Verifica se o usuário já tem uma ficha de anamnese
            if (usuario.fichaAnamnese == null) {
                // Se o usuário não tiver uma ficha de anamnese, cria-se uma nova
                val novaFichaAnamnese = FichaAnamnese(codigoFicha = null, dataPreenchimento = LocalDateTime.now())
                usuario.fichaAnamnese = fichaAnamneseRepository.save(novaFichaAnamnese)
            }
            // Associar cada resposta à ficha de anamnese do usuário
            respostas.forEach { resposta ->
                resposta.usuario = usuario
                resposta.ficha = usuario.fichaAnamnese!!
            }
            // Salvar as respostas no banco de dados
            respostaRepository.saveAll(respostas)
            ResponseEntity.noContent().build()
        } else {
            ResponseEntity.notFound().build()
        }
    }


    @PatchMapping("/endereco/{cpf}")
    fun patchEndereco(
        @PathVariable cpf: String, @RequestBody endereco: Endereco
    ): ResponseEntity<Void> {
        val usuario = repository.findByCpf(cpf)
        return if (usuario != null) {
            val enderecoSalvo = enderecoRepository.save(endereco) // Salva o endereço no banco de dados
            if (usuario.endereco == null) {
                usuario.endereco = enderecoSalvo
            } else {
                // Atualiza os atributos do endereço existente com os dados fornecidos na requisição
                usuario.endereco!!.logradouro = enderecoSalvo.logradouro
                usuario.endereco!!.numero = enderecoSalvo.numero
                usuario.endereco!!.bairro = enderecoSalvo.bairro
                usuario.endereco!!.cidade = enderecoSalvo.cidade
                usuario.endereco!!.estado = enderecoSalvo.estado
                usuario.endereco!!.cep = enderecoSalvo.cep
            }
            repository.save(usuario) // Salva o usuário no banco de dados
            ResponseEntity.noContent().build()
        } else {
            ResponseEntity.notFound().build()
        }
    }

    @PatchMapping("/nivelAcesso/{cpf}")
    fun patchNivelAcessoPorCPF(
        @PathVariable cpf: String, @RequestBody nivelAcesso: NivelAcesso
    ): ResponseEntity<Void> {
        val usuario = repository.findByCpf(cpf)
        return if (usuario != null) {
            usuario.nivelAcesso = nivelAcesso
            repository.save(usuario)
            ResponseEntity.noContent().build()
        } else {
            ResponseEntity.notFound().build()
        }
    }

    @PatchMapping("/{cpf}")
    fun patchUsuario(
        @PathVariable cpf: String, @RequestBody novoUsuario: Usuario
    ): ResponseEntity<Void> {
        val usuario = repository.findByCpf(cpf)
        return if (usuario != null) {
            usuario.nome = novoUsuario.nome
            usuario.email = novoUsuario.email
            usuario.senha = novoUsuario.senha
            usuario.instagram = novoUsuario.instagram
            usuario.telefone = novoUsuario.telefone
            usuario.telefoneEmergencial = novoUsuario.telefoneEmergencial
            usuario.genero = novoUsuario.genero
            repository.save(usuario)
            ResponseEntity.noContent().build()
        } else {
            ResponseEntity.notFound().build()
        }
    }
}

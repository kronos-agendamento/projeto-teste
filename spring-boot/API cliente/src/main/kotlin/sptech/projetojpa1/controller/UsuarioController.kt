package sptech.projetojpa1.controller

import jakarta.validation.Valid
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

    @PostMapping("/login")
    fun fazerLogin(
        @Valid @RequestParam("email") email: String?,
        @Valid @RequestParam("senha") senha: String?
       ): ResponseEntity<Any> {
        return if (!email.isNullOrBlank() && !senha.isNullOrBlank()) {
            val usuario = repository.findByEmailIgnoreCase(email)
            if (usuario != null && usuario.senha.equals(senha, ignoreCase = true)) {
                usuario.status = true
                repository.save(usuario)
                ResponseEntity.status(200).body("Login do(a) ${usuario.nome} realizado com sucesso.")
            } else {
                ResponseEntity.status(401).body("Email ou senha incorretos, verifique suas credenciais e tente novamente.")
            }
        } else {
            ResponseEntity.status(400).body("Campos obrigatórios não informados.")
        }
    }


    @PatchMapping("/logoff/{cpf}")
    fun fazerLogoff(@Valid @PathVariable cpf: String): ResponseEntity<Any> {
        val usuario = repository.findByCpf(cpf)
        return if (usuario != null) {
            usuario.status = false
            repository.save(usuario)
            ResponseEntity.status(200).body("Logoff do(a) ${usuario.nome} realizado com sucesso.")
        } else {
            ResponseEntity.status(400).body("Esse CPF não está cadastrado em nosso sistema, verifique a credencial e tente novamente.")
        }
    }

    @PostMapping ("/cadastro-usuario")
    fun cadastrarUsuario(@Valid @RequestBody novoUsuario: Usuario): ResponseEntity<Usuario> {
        val usuarioSalvo = repository.save(novoUsuario)
        return ResponseEntity.status(201).body(usuarioSalvo)
    }

    @GetMapping ("/lista-todos-usuarios-ativos")
    fun listarUsuariosAtivos(): ResponseEntity<Any> {
        val usuariosAtivos = repository.findByStatusTrue()
        return if (usuariosAtivos.isNotEmpty()) {
            ResponseEntity.status(200).body(usuariosAtivos)
        } else {
            ResponseEntity.status(204).body("Não existe nenhum usuário ativo.")
        }
    }

    @GetMapping("/lista-todos-usuarios")
    fun listarTodosUsuarios(): ResponseEntity<Any> {
        val todosUsuarios = repository.findAll()
        return if (todosUsuarios.isNotEmpty()) {
            ResponseEntity.status(200).body(todosUsuarios)
        } else {
            ResponseEntity.status(200).body("Não existe nenhum usuário cadastrado.")
        }
    }

    @GetMapping("/filtro-por-codigo/{codigo}")
    fun buscarUsuarioPorCodigo(@Valid @PathVariable codigo: Int): ResponseEntity<Any> {
        val usuario = repository.findById(codigo)
        return usuario.map {
            ResponseEntity.status(200).body<Any>(it)
        }.orElse(ResponseEntity.status(404).body("Usuário não encontrado, verifique o código fornecido e tente novamente."))
    }

    @PatchMapping("/desativacao-usuario/{codigo}")
    fun desativarUsuario(@PathVariable codigo: Int): ResponseEntity<Void> {
        return alterarStatusUsuario(codigo, false)
    }

    @PatchMapping("/ativacao-usuario/{codigo}")
    fun ativarUsuario(@Valid @PathVariable codigo: Int): ResponseEntity<Void> {
        return alterarStatusUsuario(codigo, true)
    }

    private fun alterarStatusUsuario(codigo: Int, status: Boolean): ResponseEntity<Void> {
        val usuarioOptional: Optional<Usuario> = repository.findById(codigo)
        return usuarioOptional.map { usuario ->
            usuario.status = status
            repository.save(usuario)
            ResponseEntity.status(200).build<Void>()
        }.orElse(ResponseEntity.notFound().build())
    }

    @PatchMapping(value= ["/atualizacao-foto/{codigo}"], consumes = ["image/jpeg", "image/png", "image/gif"])
    fun atualizarFotoUsuario(@Valid @PathVariable codigo: Int, @RequestBody imagem: ByteArray): ResponseEntity<Any> {
        val usuarioOptional = repository.findById(codigo)
        if (usuarioOptional.isEmpty) {
            return ResponseEntity.status(404).body("Usuário não encontrado, verifique o código fornecido e tente novamente.")
        }

        val usuario = usuarioOptional.get()
        usuario.foto = imagem
        repository.save(usuario)

        return ResponseEntity.status(200).body("Foto atualizada com sucesso para o usuário de código $codigo e com o nome de ${usuario.nome}.")
    }


    @GetMapping(value = ["/busca-imagem-usuario/{codigo}"], produces = ["image/jpeg"])
    fun getFoto(@Valid @PathVariable codigo: Int): ResponseEntity<ByteArray> {
        val foto= repository.findFotoByCodigo(codigo)
        return ResponseEntity.status(200).body(foto)
    }


    @GetMapping("/filtro-por-cpf/{cpf}")
    fun getByCPF(@Valid @PathVariable cpf: String): ResponseEntity<Any> {
        val usuario = repository.findByCpf(cpf)
        return usuario?.let {
            ResponseEntity.status(200).body(it)
        } ?: ResponseEntity.status(404).body("O CPF fornecido não foi encontrado, verifique o CPF fornecido e tente novamente.")
    }

    @GetMapping("/filtro-por-nome/{nome}")
    fun getByNomeContains(@Valid @PathVariable nome: String): ResponseEntity<Any> {
        val usuarios = repository.findByNomeContainsIgnoreCase(nome)
        return if (usuarios.isNotEmpty()) {
            ResponseEntity.status(200).body(usuarios)
        } else {
            ResponseEntity.status(404).body("Nenhum usuário foi encontrado, verifique o nome fornecido e tente novamente.")
        }
    }

    @GetMapping("/filtro-por-nivel-acesso/{codigo}")
    fun getUsuariosByNivelAcesso(@Valid @PathVariable codigo: Int): ResponseEntity<Any> {
        val nivelAcesso = nivelAcessoRepository.findById(codigo)
        return nivelAcesso.map { nivel ->
            val lista = repository.findByStatusTrueAndNivelAcesso(nivel)
            if (lista.isNotEmpty()) {
                ResponseEntity.status(200).body<Any>(lista)
            } else {
                ResponseEntity.status(404).body<Any>("Nenhum usuário foi encontrado, verifique o código fornecido e tente novamente.")
            }
        }.orElse(ResponseEntity.status(404).body<Any>("Nenhum usuário foi encontrado, verifique o código fornecido e tente novamente."))
    }


    @GetMapping("/filtro-por-status/{status}")
    fun getByStatus(@Valid @PathVariable status: Boolean): ResponseEntity<Any> {
        val usuarios = repository.findByStatus(status)
        return if (usuarios.isNotEmpty()) {
            ResponseEntity.status(200).body(usuarios)
        } else {
            ResponseEntity.status(404).body("Nenhum usuário foi encontrado, verifique o status fornecido e tente novamente.")
        }
    }

    @PatchMapping("/atualizacao-ficha/{cpf}")
    fun patchRespostasFicha(
        @Valid @PathVariable cpf: String, @Valid @RequestBody respostas: List<Resposta>
    ): ResponseEntity<Any> {
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
            ResponseEntity.status(201).body("Respostas salvas com sucesso.")
        } else {
            ResponseEntity.status(404).body("Nenhum usuário foi encontrado.")
        }
    }

    @PatchMapping("/atualizacao-endereco/{cpf}")
    fun patchEndereco(
        @Valid  @PathVariable cpf: String, @Valid @RequestBody endereco: Endereco
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

    @PatchMapping("/atualizacao-nivel-acesso/{cpf}")
    fun patchNivelAcessoPorCPF(
        @Valid  @PathVariable cpf: String, @Valid @RequestBody nivelAcesso: NivelAcesso
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

    @PatchMapping("/atualizacao-usuario/{cpf}")
    fun patchUsuario(
        @Valid  @PathVariable cpf: String, @Valid @RequestBody novoUsuario: Usuario
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
    @DeleteMapping("/exclusao-usuario/{cpf}")
    fun deleteUsuario(@Valid @PathVariable cpf: String): ResponseEntity<Any> {
        val usuario = repository.findByCpf(cpf)
        return if (usuario != null) {
            repository.delete(usuario)
            ResponseEntity.status(200).body("Usuário(a) ${usuario.nome} excluído(a) com sucesso.")
        } else {
            ResponseEntity.status(404).body("Nenhum usuário foi encontrado, verifique o CPF fornecido e tente novamente.")
        }
    }
}

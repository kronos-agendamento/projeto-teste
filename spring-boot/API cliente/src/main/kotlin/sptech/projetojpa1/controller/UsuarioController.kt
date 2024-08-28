package sptech.projetojpa1.controller

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyEmitter
import sptech.projetojpa1.dominio.Usuario
import sptech.projetojpa1.dto.usuario.UsuarioAtualizacaoRequest
import sptech.projetojpa1.dto.usuario.UsuarioLoginRequest
import sptech.projetojpa1.dto.usuario.UsuarioLoginResponse
import sptech.projetojpa1.dto.usuario.UsuarioRequest
import sptech.projetojpa1.service.UsuarioService

@RestController
@RequestMapping("/usuarios")
class UsuarioController(
    val usuarioService: UsuarioService
) {

    @Operation(summary = "Fazer login")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "201", description = "Login realizado com sucesso"),
            ApiResponse(responseCode = "400", description = "Requisição inválida. Retorna uma mensagem de erro"),
            ApiResponse(responseCode = "500", description = "Erro interno do servidor. Retorna uma mensagem de erro")
        ]
    )
    @PostMapping("/login")
    fun fazerLogin(@Valid @RequestBody login: UsuarioLoginRequest): ResponseEntity<UsuarioLoginResponse> {
        val response = usuarioService.fazerLogin(login)
        return if (response != null) {
            ResponseEntity.ok(response)
        } else {
            ResponseEntity.status(401).body(null)
        }
    }

    @Operation(summary = "Fazer logoff")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Operação bem-sucedida."),
            ApiResponse(responseCode = "404", description = "Usuário não encontrado"),
            ApiResponse(responseCode = "500", description = "Erro interno do servidor. Retorna uma mensagem de erro")
        ]
    )
    @PatchMapping("/logoff/{id}")
    fun fazerLogoffPorId(@Valid @PathVariable id: Int): ResponseEntity<String> {
        val responseMessage = usuarioService.fazerLogoffPorId(id)
        return if (responseMessage.contains("sucesso")) {
            ResponseEntity.status(200).body(responseMessage)
        } else {
            ResponseEntity.status(400).body(responseMessage)
        }
    }

    @Operation(summary = "Cadastrar novo usuário")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "201", description = "Recurso criado com sucesso. Retorna o usuário cadastrado"),
            ApiResponse(responseCode = "400", description = "Requisição inválida. Retorna uma mensagem de erro"),
            ApiResponse(responseCode = "500", description = "Erro interno do servidor. Retorna uma mensagem de erro")
        ]
    )
    @PostMapping("/cadastro-usuario")
    fun cadastrarUsuario(@Valid @RequestBody dto: UsuarioRequest): ResponseEntity<UsuarioRequest> {
        val novoUsuario = usuarioService.salvarUsuario(dto)
        return ResponseEntity.status(201).body(dto.copy(codigo = novoUsuario.codigo))
    }

    @Operation(summary = "Atualizar usuário por CPF")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Operação bem-sucedida. Retorna o usuário atualizado"),
            ApiResponse(responseCode = "404", description = "Usuário não encontrado"),
            ApiResponse(responseCode = "500", description = "Erro interno do servidor. Retorna uma mensagem de erro")
        ]
    )
    @PatchMapping("/atualizacao-usuario-por-cpf/{cpf}")
    fun atualizarUsuarioPorCpf(
        @PathVariable cpf: String,
        @Valid @RequestBody dto: UsuarioAtualizacaoRequest
    ): ResponseEntity<Usuario> {
        val usuarioAtualizado = usuarioService.atualizarUsuarioPorCpf(cpf, dto)
        return if (usuarioAtualizado != null) {
            ResponseEntity.status(200).body(usuarioAtualizado)
        } else {
            ResponseEntity.status(404).body(null)
        }
    }

    @Operation(summary = "Deletar usuário por CPF")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Operação bem-sucedida"),
            ApiResponse(responseCode = "404", description = "Usuário não encontrado"),
            ApiResponse(responseCode = "500", description = "Erro interno do servidor. Retorna uma mensagem de erro")
        ]
    )
    @DeleteMapping("/exclusao-usuario/{id}")
    fun deletarUsuarioPorId(@PathVariable id: Int): ResponseEntity<String> {
        val deletado = usuarioService.deletarUsuarioPorId(id)
        return if (deletado) {
            ResponseEntity.status(200).body("Usuário excluído com sucesso.")
        } else {
            ResponseEntity.status(404).body("Usuário não encontrado.")
        }
    }

    @GetMapping("/listar-usuarios-ativos")
    fun listarUsuariosAtivos(): ResponseEntity<List<Usuario>> {
        val usuarios = usuarioService.listarUsuariosAtivos()
        return ResponseEntity.ok(usuarios)
    }


    @Operation(summary = "Listar todos usuários")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Operação bem-sucedida. Retorna uma lista de usuários"),
            ApiResponse(
                responseCode = "204",
                description = "Requisição bem-sucedida, mas não há conteúdo para ser exibido. Retorna uma resposta vazia"
            ),
            ApiResponse(responseCode = "500", description = "Erro interno do servidor. Retorna uma mensagem de erro")
        ]
    )
    @GetMapping
    fun listarTodosUsuarios(): ResponseEntity<List<Usuario>> {
        val usuarios = usuarioService.listarTodosUsuarios()
        return ResponseEntity.ok(usuarios)
    }

    @GetMapping("/buscar-top3-indicacoes")
    fun buscarTop3Indicacoes(): ResponseEntity<List<String>>{
        val resultado = usuarioService.findTop3Indicacoes()
        return ResponseEntity.ok(resultado)
    }

    @GetMapping("/buscar-numeros-indicacoes")
    fun buscarNumerosIndicacoes(): ResponseEntity<List<Int>>{
        val resultado = usuarioService.buscarNumeroIndicacoes()
        return ResponseEntity.ok(resultado)
    }

    @Operation(summary = "Listar usuários por descrição")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Operação bem-sucedida. Retorna o usuário encontrado"),
            ApiResponse(responseCode = "404", description = "Usuário não encontrado"),
            ApiResponse(responseCode = "500", description = "Erro interno do servidor. Retorna uma mensagem de erro")
        ]
    )
    @GetMapping("/buscar-usuario-por-codigo/{codigo}")
    fun buscarUsuarioPorCodigo(@PathVariable codigo: Int): ResponseEntity<Usuario> {
        val usuario = usuarioService.buscarUsuarioPorCodigo(codigo)
        return if (usuario != null) {
            ResponseEntity.ok(usuario)
        } else {
            ResponseEntity.status(404).body(null)
        }
    }


    @Operation(summary = "Atualizar foto de usuário")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Operação bem-sucedida. Retorna o usuário atualizado"),
            ApiResponse(responseCode = "404", description = "Usuário não encontrado"),
            ApiResponse(responseCode = "500", description = "Erro interno do servidor. Retorna uma mensagem de erro")
        ]
    )
    @PatchMapping(
        value = ["/atualizacao-foto/{codigo}"],
        consumes = ["image/jpeg", "image/png", "image/gif", "image/jpg"]
    )
    fun atualizarFotoUsuario(@PathVariable cpf: String, @RequestBody foto: ByteArray): ResponseEntity<Usuario> {
        val usuario = usuarioService.atualizarFotoUsuario(cpf, foto)
        return if (usuario != null) {
            ResponseEntity.status(200).body(usuario)
        } else {
            ResponseEntity.status(404).body(null)
        }
    }

    @Operation(summary = "Buscar foto de usuário")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Operação bem-sucedida. Retorna o usuário encontrado"),
            ApiResponse(responseCode = "404", description = "Usuário não encontrado"),
            ApiResponse(responseCode = "500", description = "Erro interno do servidor. Retorna uma mensagem de erro")
        ]
    )
    @GetMapping(
        value = ["/busca-imagem-usuario/{codigo}"],
        produces = ["image/jpeg", "image/png", "image/gif", "image/jpg"]
    )
    fun getFoto(@PathVariable codigo: Int): ResponseEntity<ByteArray> {
        val foto = usuarioService.getFoto(codigo)
        return if (foto != null) {
            ResponseEntity.ok(foto)
        } else {
            ResponseEntity.status(404).body(null)
        }
    }

    @Operation(summary = "Upload de foto do usuário")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Foto enviada com sucesso"),
            ApiResponse(responseCode = "404", description = "Usuário não encontrado"),
            ApiResponse(responseCode = "500", description = "Erro interno do servidor. Retorna uma mensagem de erro")
        ]
    )
    @PostMapping("/upload-foto/{cpf}")
    fun uploadFoto(
        @PathVariable cpf: String,
        @RequestParam("file") file: MultipartFile
    ): ResponseEntity<String> {
        return try {
            val usuario = usuarioService.atualizarFotoUsuario(cpf, file.bytes)
            if (usuario != null) {
                ResponseEntity.status(200).body("Foto enviada com sucesso")
            } else {
                ResponseEntity.status(404).body("Usuário não encontrado")
            }
        } catch (e: Exception) {
            ResponseEntity.status(500).body("Erro ao enviar foto: ${e.message}")
        }
    }

    @Operation(summary = "Listar usuários por CPF")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Operação bem-sucedida. Retorna o usuário encontrado"),
            ApiResponse(responseCode = "404", description = "Usuário não encontrado"),
            ApiResponse(responseCode = "500", description = "Erro interno do servidor. Retorna uma mensagem de erro")
        ]
    )
    @GetMapping("/buscar-por-id/{id}")
    fun getById(@PathVariable id: Int): ResponseEntity<Usuario> {
        val usuario = usuarioService.getById(id)
        return if (usuario != null) {
            ResponseEntity.ok(usuario)
        } else {
            ResponseEntity.status(404).body(null)
        }
    }

    @Operation(summary = "Listar usuários por nome")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Operação bem-sucedida. Retorna o usuário encontrado"),
            ApiResponse(responseCode = "404", description = "Usuário não encontrado"),
            ApiResponse(responseCode = "500", description = "Erro interno do servidor. Retorna uma mensagem de erro")
        ]
    )
    @GetMapping("/buscar-por-nome/{nome}")
    fun getByNomeContains(@PathVariable nome: String): ResponseEntity<List<Usuario>> {
        val usuarios = usuarioService.getByNomeContains(nome)
        return ResponseEntity.ok(usuarios)
    }

    @Operation(summary = "Listar usuários por nível de acesso")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Operação bem-sucedida. Retorna o usuário encontrado"),
            ApiResponse(responseCode = "404", description = "Usuário não encontrado"),
            ApiResponse(responseCode = "500", description = "Erro interno do servidor. Retorna uma mensagem de erro")
        ]
    )
    @GetMapping("/buscar-usuarios-por-nivel-acesso/{codigo}")
    fun getUsuariosByNivelAcesso(@PathVariable codigo: Int): ResponseEntity<List<Usuario>> {
        val usuarios = usuarioService.getUsuariosByNivelAcesso(codigo)
        return ResponseEntity.ok(usuarios)
    }


    @Operation(summary = "Listar usuários por status")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Operação bem-sucedida. Retorna o usuário encontrado"),
            ApiResponse(responseCode = "404", description = "Usuário não encontrado"),
            ApiResponse(responseCode = "500", description = "Erro interno do servidor. Retorna uma mensagem de erro")
        ]
    )
    @GetMapping("/buscar-por-status/{status}")
    fun getByStatus(@PathVariable status: Boolean): ResponseEntity<List<Usuario>> {
        val usuarios = usuarioService.getByStatus(status)
        return ResponseEntity.ok(usuarios)
    }

    @GetMapping("/canais-de-divulgacao")
    fun getCanaisDeDivulgacao(): ResponseEntity<List<Usuario>> {
        val resultado: List<Usuario> = usuarioService.getIndicacoesFontes()
        return ResponseEntity.ok(resultado)
    }

    @GetMapping("/clientes-ativos")
    fun getClientesAtivosUltimosTresMeses(): ResponseEntity<Int> {
        val numeroClientes = usuarioService.getClientesAtivos()
        return ResponseEntity.ok(numeroClientes)
    }

    @GetMapping("/clientes-inativos")
    fun getClientesInativos(): ResponseEntity<Int> {
        val clientes = usuarioService.getClientesInativos()
        return ResponseEntity.ok(clientes)
    }

    @GetMapping("/clientes-fidelizados-ultimos-tres-meses")
    fun getClientesFidelizadosUltimosTresMeses(): ResponseEntity<Int> {
        val clientes = usuarioService.getClientesFidelizadosUltimosTresMeses()
        return ResponseEntity.ok(clientes)
    }

    @Operation(summary = "Listar usuário por CPF")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Operação bem-sucedida. Retorna o usuário encontrado"),
            ApiResponse(responseCode = "404", description = "Usuário não encontrado"),
            ApiResponse(responseCode = "500", description = "Erro interno do servidor. Retorna uma mensagem de erro")
        ]
    )
    @GetMapping("/buscar-por-cpf/{cpf}")
    fun getByCpf(@PathVariable cpf: String): ResponseEntity<Usuario> {
        val usuario = usuarioService.getByCpf(cpf)
        return if (usuario != null) {
            ResponseEntity.ok(usuario)
        } else {
            ResponseEntity.status(404).body(null)
        }
    }
}


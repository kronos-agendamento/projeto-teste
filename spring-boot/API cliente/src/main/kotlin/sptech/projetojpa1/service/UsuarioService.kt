package sptech.projetojpa1.service

import jakarta.persistence.EntityManager
import org.springframework.transaction.annotation.Transactional
import jakarta.validation.ConstraintViolationException
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.transaction.annotation.Propagation
import org.springframework.stereotype.Service
import sptech.projetojpa1.domain.Usuario
import sptech.projetojpa1.domain.usuario.Cliente
import sptech.projetojpa1.domain.usuario.Profissional
import sptech.projetojpa1.dto.usuario.*
import sptech.projetojpa1.repository.*

@Service
class UsuarioService(
    @Autowired private val usuarioRepository: UsuarioRepository,
    @Autowired private val nivelAcessoRepository: NivelAcessoRepository,
    @Autowired private val enderecoRepository: EnderecoRepository,
    @Autowired private val empresaRepository: EmpresaRepository,
    @Autowired private val fichaAnamneseRepository: FichaAnamneseRepository,
    @Autowired private val entityManager: EntityManager,
) {
    fun salvarUsuario(dto: UsuarioRequest): Usuario {
        val usuario: Usuario = when (dto.nivelAcessoId) {
            1 -> { // Nível 1 é Administrador ou Profissional
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
                    especialidade = "" // ajuste para a especialidade conforme necessário
                )
            }

            2 -> { // Nível 2 é Profissional
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
                    especialidade = "" // ajuste para a especialidade conforme necessário
                )
            }

            3 -> { // Nível 3 é Cliente
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
                    nivelAcesso = dto.nivelAcessoId.let { nivelAcessoRepository.findById(it).orElse(null) },
                    endereco = dto.enderecoId?.let { enderecoRepository.findById(it).orElse(null) },
                    empresa = dto.empresaId?.let { empresaRepository.findById(it).orElse(null) },
                    fichaAnamnese = dto.fichaAnamneseId?.let { fichaAnamneseRepository.findById(it).orElse(null) }
                )
            }

            else -> throw IllegalArgumentException("Nível de acesso inválido: ${dto.nivelAcessoId}")
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
                empresa = usuario.empresa,
                nivelAcesso = usuario.nivelAcesso,
                idUsuario = usuario.codigo,
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

        // Verificar se o endereço foi passado e se ele não tem um ID, ou seja, é novo
        dto.endereco?.let { enderecoDto ->
            if (enderecoDto.idEndereco == null) {
                // Salvar o endereço primeiro, se ele for novo (não tiver ID)
                val enderecoSalvo = enderecoRepository.save(enderecoDto)
                usuario.endereco = enderecoSalvo
            } else {
                // Se o endereço já existir, buscar o endereço pelo ID e associar
                val enderecoExistente = enderecoRepository.findById(enderecoDto.idEndereco)
                usuario.endereco = enderecoExistente.orElse(usuario.endereco)
            }
        }

        // Atualizar os outros campos de usuário com os valores enviados
        usuario.apply {
            nome = dto.nome ?: nome
            email = dto.email ?: email
            instagram = dto.instagram ?: instagram
            dataNasc = dto.dataNasc ?: dataNasc
            telefone = dto.telefone ?: telefone
            genero = dto.genero ?: genero
            indicacao = dto.indicacao ?: indicacao
            avaliacao = dto.avaliacao ?: avaliacao
            senha = dto.senha ?: senha
        }

        // Salvar o usuário atualizado
        return usuarioRepository.save(usuario)
    }


    fun atualizarUsuarioPorId(id: Int, dto: UsuarioAtualizacaoRequest): Usuario? {
        val usuario = usuarioRepository.findById(id).orElse(null) ?: return null
        usuario.apply {
            nome = dto.nome ?: nome
            email = dto.email ?: email
            instagram = dto.instagram ?: instagram
            dataNasc = dto.dataNasc ?: dataNasc
            telefone = dto.telefone ?: telefone
            genero = dto.genero ?: genero
            indicacao = dto.indicacao ?: indicacao
            avaliacao = dto.avaliacao ?: avaliacao
            nivelAcesso = dto.nivelAcesso?.let { nivelAcessoRepository.findById(it).orElse(null) } ?: nivelAcesso
        }
        return usuarioRepository.save(usuario)
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    fun deletarUsuarioPorId(id: Int): Boolean {
        println("Iniciando exclusão do usuário com ID: $id")
        return try {
            val deletados = usuarioRepository.deletarPorId(id)
            if (deletados > 0) {
                println("Usuário com ID $id excluído com sucesso.")
                true
            } else {
                println("Usuário com ID $id não encontrado.")
                false
            }
        } catch (e: Exception) {
            println("Erro ao excluir o usuário com ID $id: ${e.message}")
            false
        }
    }

    fun listarUsuariosAtivos(): List<Usuario> = usuarioRepository.findByStatusTrue()

    fun listarTodosUsuarios(): List<UsuarioResponseDTO> {
        val usuarios = usuarioRepository.findAll()
        return usuarios.map { usuario ->
            UsuarioResponseDTO(
                idUsuario = usuario.codigo,
                nome = usuario.nome,
                dataNasc = usuario.dataNasc,
                instagram = usuario.instagram,
                telefone = usuario.telefone,
                cpf = usuario.cpf,
                status = usuario.status,
                avaliacao = usuario.avaliacao
            )
        }
    }

    fun getByCpf(cpf: String): UsuarioResponseDTO? {
        val usuario = usuarioRepository.findByCpf(cpf) ?: return null
        return UsuarioResponseDTO(
            idUsuario = usuario.codigo,
            nome = usuario.nome,
            instagram = usuario.instagram,
            telefone = usuario.telefone,
            cpf = usuario.cpf,
            dataNasc = usuario.dataNasc,
            status = usuario.status,
            empresa = usuario.empresa,
            indicacao = usuario.indicacao,
            genero = usuario.genero,
            senha = usuario.senha,
            email = usuario.email,
            avaliacao = usuario.avaliacao,
            endereco = usuario.endereco
        )
    }

    fun getByStatus(status: Boolean): List<UsuarioResponseDTO> {
        val usuarios = usuarioRepository.findByStatus(status)
        return usuarios.map { usuario ->
            UsuarioResponseDTO(
                idUsuario = usuario.codigo,
                nome = usuario.nome,
                email = usuario.email,
                instagram = usuario.instagram,
                telefone = usuario.telefone,
                cpf = usuario.cpf,
                dataNasc = usuario.dataNasc,
                status = usuario.status,
                endereco = usuario.endereco,
                avaliacao = usuario.avaliacao
            )
        }
    }

    fun atualizarFotoUsuario(cpf: String, imagem: ByteArray): Usuario? {
        val usuario = usuarioRepository.findByCpf(cpf) ?: return null
        usuario.foto = imagem
        return usuarioRepository.save(usuario)
    }


    fun getFoto(cpf: String): ByteArray? = usuarioRepository.findFotoByCpf(cpf)
    fun getFotoPorNome(nome: String): ByteArray? = usuarioRepository.findFotoByNomeContainsIgnoreCase(nome)

    fun getUsuariosByNivelAcesso(codigo: Int): List<Usuario> {
        val nivelAcesso = nivelAcessoRepository.findById(codigo).orElse(null)
        return if (nivelAcesso != null) {
            usuarioRepository.findByStatusTrueAndNivelAcesso(nivelAcesso)
        } else {
            emptyList()
        }
    }

    fun getById(id: Int): UsuarioResponseDTO? {
        val usuario = usuarioRepository.findById(id).orElse(null)
        return if (usuario != null) {
            UsuarioResponseDTO(
                idUsuario = usuario.codigo,
                nivelAcesso = usuario.nivelAcesso?.codigo,
                nome = usuario.nome,
                instagram = usuario.instagram,
                telefone = usuario.telefone,
                email = usuario.email,
                indicacao = usuario.indicacao,
                genero = usuario.genero,
                cpf = usuario.cpf,
                dataNasc = usuario.dataNasc,
                status = usuario.status,
                endereco = usuario.endereco,
                avaliacao = usuario.avaliacao
            )
        } else {
            null
        }
    }

    fun getIndicacoesFontes(): List<Usuario> = usuarioRepository.findClientesPorOrigem()

    fun getClientesAtivos(startDate: String?, endDate: String?): Int {
        return usuarioRepository.findClientesAtivos(startDate, endDate)
    }


    fun findTop3Indicacoes(): List<String> {
        return usuarioRepository.findTop3Indicacoes()
    }

    fun buscarNumeroIndicacoes(): List<Map<String, Any>> {
        return usuarioRepository.buscarNumerosDivulgacao()
    }

    fun getClientesInativos(startDate: String?, endDate: String?): Int {
        return usuarioRepository.findClientesInativos(startDate, endDate)
    }


    fun getClientesFidelizadosUltimosTresMeses(startDate: String?, endDate: String?): Int {
        return usuarioRepository.findClientesFidelizadosUltimosTresMeses(startDate, endDate)
    }


    @Transactional
    fun atualizarStatusParaInativo(cpf: String): UsuarioResponseDTO? {
        val usuario = usuarioRepository.findByCpf(cpf)
        return if (usuario != null) {
            println("Usuário encontrado: $usuario")
            if (usuario.status == false) {
                println("Usuário já está inativo.")
                return UsuarioResponseDTO(
                    idUsuario = usuario.codigo,
                    nome = usuario.nome,
                    instagram = usuario.instagram,
                    telefone = usuario.telefone,
                    cpf = usuario.cpf,
                    dataNasc = usuario.dataNasc,
                    status = usuario.status,
                    avaliacao = usuario.avaliacao
                )
            }
            usuario.status = false
            usuarioRepository.save(usuario)
            entityManager.flush() // Garantir que a transação seja sincronizada com o banco
            println("Status atualizado para: ${usuario.status}")
            return UsuarioResponseDTO(
                idUsuario = usuario.codigo,
                nome = usuario.nome,
                instagram = usuario.instagram,
                telefone = usuario.telefone,
                cpf = usuario.cpf,
                dataNasc = usuario.dataNasc,
                status = usuario.status,
                avaliacao = usuario.avaliacao
            )
        } else {
            println("Usuário não encontrado para o CPF: $cpf")
            null
        }
    }

    @Transactional
    fun atualizarStatusParaAtivo(cpf: String): UsuarioResponseDTO? {
        val usuario = usuarioRepository.findByCpf(cpf)
        return if (usuario != null) {
            println("Usuário encontrado: $usuario")
            if (usuario.status == true) {
                println("Usuário já está ativo.")
                return UsuarioResponseDTO(
                    idUsuario = usuario.codigo,
                    cpf = usuario.cpf,
                    nome = usuario.nome,
                    status = usuario.status,
                    avaliacao = usuario.avaliacao
                )
            }
            usuario.status = true
            usuarioRepository.save(usuario)
            entityManager.flush() // Garantir que a transação seja sincronizada com o banco
            println("Status atualizado para: ${usuario.status}")
            return UsuarioResponseDTO(
                idUsuario = usuario.codigo,
                cpf = usuario.cpf,
                nome = usuario.nome,
                status = usuario.status,
                avaliacao = usuario.avaliacao
            )
        } else {
            println("Usuário não encontrado para o CPF: $cpf")
            null
        }
    }

    fun atualizarStatusUsuarioInativoPorId(id: Int): UsuarioResponseDTO? {
        val usuario = usuarioRepository.findById(id).orElse(null)
        return if (usuario != null) {
            println("CPF do usuário: ${usuario.cpf}")
            if (usuario.status == false) {
                return UsuarioResponseDTO(
                    idUsuario = usuario.codigo,
                    nome = usuario.nome,
                    instagram = usuario.instagram,
                    telefone = usuario.telefone,
                    cpf = usuario.cpf,
                    dataNasc = usuario.dataNasc,
                    status = usuario.status,
                    avaliacao = usuario.avaliacao
                )
            }
            usuario.status = false
            try {
                usuarioRepository.save(usuario)
            } catch (e: ConstraintViolationException) {
                println("Erro de validação: ${e.message}")
                return null // ou outra forma de tratar o erro
            }
            UsuarioResponseDTO(
                idUsuario = usuario.codigo,
                nome = usuario.nome,
                instagram = usuario.instagram,
                telefone = usuario.telefone,
                cpf = usuario.cpf,
                dataNasc = usuario.dataNasc,
                status = usuario.status,
                avaliacao = usuario.avaliacao
            )
        } else {
            null
        }
    }

    fun atualizarStatusUsuarioAtivoPorId(id: Int): UsuarioResponseDTO? {
        val usuario = usuarioRepository.findById(id).orElse(null)
        return if (usuario != null) {
            if (usuario.status == true) {
                return UsuarioResponseDTO(
                    idUsuario = usuario.codigo,
                    nome = usuario.nome,
                    instagram = usuario.instagram,
                    telefone = usuario.telefone,
                    cpf = usuario.cpf,
                    dataNasc = usuario.dataNasc,
                    status = usuario.status,
                    avaliacao = usuario.avaliacao
                )
            }
            usuario.status = true
            usuarioRepository.save(usuario)
            UsuarioResponseDTO(
                idUsuario = usuario.codigo,
                nome = usuario.nome,
                instagram = usuario.instagram,
                telefone = usuario.telefone,
                cpf = usuario.cpf,
                dataNasc = usuario.dataNasc,
                status = usuario.status,
                avaliacao = usuario.avaliacao
            )
        } else {
            null
        }
    }

    fun getClientesConcluidosUltimos5Meses(startDate: String?, endDate: String?): List<Map<String, Any>> {
        return usuarioRepository.findClientesFidelizadosComPeriodo(startDate, endDate)
    }


    fun getClientesFidelizadosUltimos5MesesComPeriodo(startDate: String?, endDate: String?): List<Map<String, Any>> {
        return usuarioRepository.findClientesFidelizadosComPeriodo(startDate, endDate)
    }


    fun getByNomeContains(nome: String): List<UsuarioDTO> {
        return usuarioRepository.findByNomeContainsIgnoreCase(nome)
            .map { usuario ->
                UsuarioDTO(
                    codigo = usuario.codigo!!,
                    nome = usuario.nome.toString(),
                    instagram = usuario.instagram.toString(),
                    telefone = usuario.telefone.toString(),
                    cpf = usuario.cpf.toString()
                )
            }
    }

    fun buscarUsuarioPorCodigo(codigo: Int): Usuario? = usuarioRepository.findById(codigo).orElse(null)

    fun countUsuariosWithStatusZero(): Int {
        return usuarioRepository.countByStatus(false)
    }

    fun countUsuariosWithStatusUm(): Int {
        return usuarioRepository.countByStatus(true)
    }

    fun buscarClientesFidel(): List<UsuarioResponseDTO> {
        val clientes = usuarioRepository.findClientesFidel()
        return clientes.map { row ->
            UsuarioResponseDTO(
                idUsuario = (row["idUsuario"] as Number).toInt(),
                nome = row["nome"] as String?,
                dataNasc = (row["dataNasc"] as java.sql.Date)?.toLocalDate(),
                instagram = row["instagram"] as String?,
                telefone = (row["telefone"] as Number)?.toLong(),
                cpf = row["cpf"] as String?,
                status = row["status"] as Boolean?,
                email = row["email"] as String?,
                genero = row["genero"] as String?,
                indicacao = row["indicacao"] as String?,
                endereco = null,
                avaliacao = row["avaliacao"] as Int?// Ajuste conforme necessário
            )
        }
    }

    fun top5CidadesComMaisClientes(): List<Map<String, Any>> {
        val clientesPorBairroECidade = usuarioRepository.findAll()
            .filter { it.endereco != null } // Filtra usuários que possuem endereço
            .groupBy { it.endereco!!.bairro to it.endereco!!.cidade } // Agrupa por bairro e cidade
            .map { (bairroCidade, clientes) ->
                val (bairro, cidade) = bairroCidade // Desestrutura o bairro e a cidade
                mapOf(
                    "bairro" to bairro,
                    "cidade" to cidade, // Adiciona a cidade ao resultado
                    "clientes" to clientes.size
                )
            }
            .sortedByDescending { it["clientes"] as Int } // Ordena pela quantidade de clientes
            .take(5) // Retorna os top 5

        return clientesPorBairroECidade
    }

    fun top3CidadesPorPorcentagemClientes(): List<Map<String, Any>> {
        val totalClientes = usuarioRepository.count()
        return usuarioRepository.findAll()
            .filter { it.endereco != null } // Filtra usuários que possuem endereço
            .groupBy { it.endereco!!.cidade } // Agrupa por cidade
            .map { (cidade, clientes) -> // Mapeia para um formato que contenha cidade e porcentagem
                mapOf(
                    "cidade" to cidade,
                    "porcentagem" to (clientes.size.toDouble() / totalClientes) * 100
                )
            }
            .sortedByDescending { it["porcentagem"] as Double } // Ordena por porcentagem de forma decrescente
            .take(3) // Retorna apenas os top 3
    }

    fun listarLeads(): List<Map<String, Any>> = usuarioRepository.listarLeads()

    fun getUsuariosPorIdEmpresa(empresaId: Int): List<UsuarioEmpresaDTO> {
        val usuarios = usuarioRepository.findAllByEmpresaIdEmpresa(empresaId)
        return usuarios.map {
            UsuarioEmpresaDTO(
                codigo = it.codigo,
                nome = it.nome,
                nivelAcesso = it.nivelAcesso?.nivel,
                endereco = it.endereco?.idEndereco,
            )
        }
    }

    fun atualizarAvaliacao(cpf: String, pontuacao: Int): Usuario? {
        val usuario = usuarioRepository.findByCpf(cpf)

        return if (usuario != null) {
            // Sobrescreve a pontuação atual com a nova avaliação
            usuario.avaliacao = pontuacao
            usuarioRepository.save(usuario) // Salva o usuário com a nova avaliação
        } else {
            null
        }
    }
}
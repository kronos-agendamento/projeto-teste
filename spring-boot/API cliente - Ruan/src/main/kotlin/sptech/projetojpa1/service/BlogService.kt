package sptech.projetojpa1.service

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import sptech.projetojpa1.dominio.Comentario
import sptech.projetojpa1.dominio.Publicacao
import sptech.projetojpa1.dto.comentario.ComentarioRequest
import sptech.projetojpa1.dto.publicacao.PublicacaoRequest
import sptech.projetojpa1.repository.ComentarioRepository
import sptech.projetojpa1.repository.PublicacaoRepository
import sptech.projetojpa1.repository.UsuarioRepository

@Service
class BlogService(
    @Autowired private val publicacaoRepository: PublicacaoRepository,
    @Autowired private val comentarioRepository: ComentarioRepository,
    @Autowired private val usuarioRepository: UsuarioRepository
) {
    fun criarPublicacao(request: PublicacaoRequest, idUsuario: Int): Publicacao {
        val usuario =
            usuarioRepository.findById(idUsuario).orElseThrow { IllegalArgumentException("Usuário não encontrado") }
        val publicacao = Publicacao(null, request.titulo, request.legenda, request.foto, 0, usuario)
        return publicacaoRepository.save(publicacao)
    }

    fun editarPublicacao(idPublicacao: Int, request: PublicacaoRequest): Publicacao {
        val publicacao = publicacaoRepository.findById(idPublicacao)
            .orElseThrow { IllegalArgumentException("Publicação não encontrada") }
        publicacao.titulo = request.titulo
        publicacao.legenda = request.legenda
        publicacao.foto = request.foto
        return publicacaoRepository.save(publicacao)
    }

    fun excluirPublicacao(idPublicacao: Int) {
        publicacaoRepository.deleteById(idPublicacao)
    }

    fun listarPublicacoes(): List<Publicacao> {
        return publicacaoRepository.findAll()
    }

    fun adicionarComentario(request: ComentarioRequest, idUsuario: Int): Comentario {
        val usuario =
            usuarioRepository.findById(idUsuario).orElseThrow { IllegalArgumentException("Usuário não encontrado") }
        val publicacao = publicacaoRepository.findById(request.idPublicacao)
            .orElseThrow { IllegalArgumentException("Publicação não encontrada") }
        val comentario = Comentario(null, request.texto, 0, publicacao, usuario)
        return comentarioRepository.save(comentario)
    }

    fun editarComentario(idComentario: Int, request: ComentarioRequest): Comentario {
        val comentario = comentarioRepository.findById(idComentario)
            .orElseThrow { IllegalArgumentException("Comentário não encontrado") }
        comentario.texto = request.texto
        return comentarioRepository.save(comentario)
    }

    fun excluirComentario(idComentario: Int) {
        comentarioRepository.deleteById(idComentario)
    }

    fun listarComentarios(idPublicacao: Int): List<Comentario> {
        return comentarioRepository.findByPublicacaoId(idPublicacao)
    }

    fun curtirPublicacao(idPublicacao: Int) {
        val publicacao = publicacaoRepository.findById(idPublicacao)
            .orElseThrow { IllegalArgumentException("Publicação não encontrada") }
        publicacao.curtidas += 1
        publicacaoRepository.save(publicacao)
    }

    fun descurtirPublicacao(idPublicacao: Int) {
        val publicacao = publicacaoRepository.findById(idPublicacao)
            .orElseThrow { IllegalArgumentException("Publicação não encontrada") }
        publicacao.curtidas -= 1
        publicacaoRepository.save(publicacao)
    }

    fun curtirComentario(idComentario: Int) {
        val comentario = comentarioRepository.findById(idComentario)
            .orElseThrow { IllegalArgumentException("Comentário não encontrado") }
        comentario.curtidas += 1
        comentarioRepository.save(comentario)
    }

    fun descurtirComentario(idComentario: Int) {
        val comentario = comentarioRepository.findById(idComentario)
            .orElseThrow { IllegalArgumentException("Comentário não encontrado") }
        comentario.curtidas -= 1
        comentarioRepository.save(comentario)
    }
}

package sptech.projetojpa1.dominio

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.ManyToOne
import org.jetbrains.annotations.NotNull

@Entity
class Pergunta(
    // Código da pergunta
    @field:Id @field:GeneratedValue(strategy = GenerationType.IDENTITY) var codigoPergunta: Int,
    // Descrição da pergunta
    var descricao: String,
    // Tipo da pergunta
    var tipo: String,
    // Status da pergunta
    var status: Boolean = false
)
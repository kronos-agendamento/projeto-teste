package sptech.projetojpa1.dto.especificacao

import com.fasterxml.jackson.annotation.JsonIgnore
import jakarta.persistence.Column
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id

data class EspecificacaoFotoRequest(
    @field:Column(length = 100 * 1024 * 1024) //name = "musica_foto")
    @JsonIgnore
    var foto: ByteArray
)

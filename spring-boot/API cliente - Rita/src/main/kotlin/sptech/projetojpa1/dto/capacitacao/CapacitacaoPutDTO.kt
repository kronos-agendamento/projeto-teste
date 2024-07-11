package sptech.projetojpa1.dto.capacitacao

import jakarta.persistence.Column
import jakarta.validation.constraints.*

class CapacitacaoPutDTO (

    @field:Size(max = 30, message = "O nome do procedimento deve ter no máximo 30 caracteres")
    var nome: String?,

    @field:Size(min = 1, max = 500, message = "O campo descrição deve ter entre 1 e 500 caracteres")
    var descricao: String?,

    @field:Size(max = 50, message = "O nível deve ter no máximo 50 caracteres")
    var nivel: String?,

    @field:Size(max = 50, message = "A modalidade deve ter no máximo 50 caracteres")
    var modalidade: String?,

    @field:Pattern(regexp = "^([0-1]\\d|2[0-3]):([0-5]\\d)$", message = "A carga horária deve estar no formato HH:MM")
    @Column(name = "carga_horaria")
    var cargaHoraria: String?,

    @field:PositiveOrZero(message = "Preço de Capacitação deve ser zero ou positivo")
    @Column(name = "preco_capacitacao")
    var precoCapacitacao: Double?,

    @field:NotNull(message = "Status de Capacitação não pode ser nulo")
    @Column(name = "ativo")
    var ativo: Boolean? = true
){

}
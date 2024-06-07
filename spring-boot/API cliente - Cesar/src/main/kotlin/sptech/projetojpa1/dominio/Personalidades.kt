package sptech.projetojpa1.dominio

import jakarta.persistence.*


@Entity
class Personalidades (
    @field:Id
    @field:GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_personalidade")
    var codigoPersonalidade: Int? = null,

    @Column(name = "personalidade")
    var personalidade: String,
)
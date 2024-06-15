package sptech.projetojpa1.service

import org.springframework.stereotype.Service
import sptech.projetojpa1.dominio.FichaAnamnese
import sptech.projetojpa1.dto.FichaRequest
import sptech.projetojpa1.dto.FichaResponse
import sptech.projetojpa1.repository.FichaAnamneseRepository

@Service
data class FichaAnamneseService(
    val fichaAnamneseRepository: FichaAnamneseRepository
) {
    fun cadastrarFichaAnamnese(novaFichaAnamneseDTO: FichaRequest): FichaResponse {
        val novaFichaAnamnese = FichaAnamnese(
            codigoFicha = null,
            dataPreenchimento = novaFichaAnamneseDTO.dataPreenchimento
        )
        val fichaAnamneseSalva = fichaAnamneseRepository.save(novaFichaAnamnese)
        return FichaResponse(
            codigoFicha = fichaAnamneseSalva.codigoFicha,
            dataPreenchimento = fichaAnamneseSalva.dataPreenchimento
        )
    }

    fun listarFichasAnamnese(): List<FichaResponse> {
        return fichaAnamneseRepository.findAll().map {
            FichaResponse(
                codigoFicha = it.codigoFicha,
                dataPreenchimento = it.dataPreenchimento
            )
        }
    }
}

package sptech.projetojpa1.dto.agendamento

import java.time.LocalDate
import java.time.LocalTime

data class BloqueioRequestDTO(
    val dia: String, // ISO-8601 string format (e.g., "2024-10-02")
    val horaInicio: String, // Time string in ISO-8601 format (e.g., "09:48:00")
    val horaFim: String, // Time string in ISO-8601 format (e.g., "23:48:00")
    val usuarioId: Int
)


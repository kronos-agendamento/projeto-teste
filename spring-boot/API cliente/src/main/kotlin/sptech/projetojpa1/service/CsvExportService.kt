package sptech.projetojpa1.service

import org.springframework.stereotype.Service
import sptech.projetojpa1.dto.csvexport.DadosExportRequest
import java.io.ByteArrayOutputStream
import java.io.OutputStreamWriter
import java.util.*

@Service
class CsvExportService {

    fun gerarCsv(dadosRequest: DadosExportRequest): ByteArray {
        val outputStream = ByteArrayOutputStream()
        val writer = OutputStreamWriter(outputStream, Charsets.UTF_8)
        val formatter = Formatter(writer)

        // Escrevendo o cabeçalho do CSV
        formatter.format("Título;Dado;Data Início;Data Fim\n")

        // Processando as métricas (KPIs)
        dadosRequest.metricas.forEach { metrica ->
            formatter.format(
                "%s;%s;%s;%s\n",
                metrica.titulo,
                metrica.dado,
                metrica.dataInicio ?: "N/A",
                metrica.dataFim ?: "N/A"
            )
        }

        // Processando os gráficos
        dadosRequest.graficos.forEach { grafico ->
            formatter.format(
                "%s;Distribuição de dados;%s;%s\n",
                grafico.titulo,
                grafico.dataInicio,
                grafico.dataFim
            )

            grafico.valores.forEach { valor ->
                formatter.format(
                    " - %s;%d;;;\n",
                    valor.categoria,
                    valor.quantidade
                )
            }
        }

        writer.flush()
        return outputStream.toByteArray()
    }










}
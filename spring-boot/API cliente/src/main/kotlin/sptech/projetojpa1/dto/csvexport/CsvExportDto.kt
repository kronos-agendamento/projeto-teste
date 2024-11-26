package sptech.projetojpa1.dto.csvexport

data class DadosExportRequest(
    val metricas: List<MetricaRequest>,
    val graficos: List<GraficoRequest>
)

data class MetricaRequest(
    val titulo: String,
    val dado: String,
    val dataInicio: String?,
    val dataFim: String?
)

data class GraficoRequest(
    val titulo: String,
    val dataInicio: String,
    val dataFim: String,
    val valores: List<ValorRequest>
)

data class ValorRequest(
    val categoria: String,
    val quantidade: Int
)
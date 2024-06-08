package sptech.projetojpa1.service

import org.springframework.stereotype.Service
import sptech.projetojpa1.dominio.Empresa
import sptech.projetojpa1.dto.empresa.EmpresaRequestDTO
import sptech.projetojpa1.dto.empresa.EmpresaResponseDTO
import sptech.projetojpa1.dto.empresa.EmpresaUpdateDTO
import sptech.projetojpa1.repository.EmpresaRepository
import sptech.projetojpa1.repository.EnderecoRepository
import sptech.projetojpa1.repository.HorarioFuncionamentoRepository

@Service
class EmpresaService(
    private val empresaRepository: EmpresaRepository,
    private val enderecoRepository: EnderecoRepository,
    private val horarioFuncionamentoRepository: HorarioFuncionamentoRepository
) {

    fun cadastrarEmpresa(dto: EmpresaRequestDTO): EmpresaResponseDTO {
        val endereco = enderecoRepository.findById(dto.enderecoId)
            .orElseThrow { IllegalArgumentException("Endereço não encontrado") }

        val horarioFuncionamento = dto.horarioFuncionamentoId?.let {
            horarioFuncionamentoRepository.findById(it)
                .orElseThrow { IllegalArgumentException("Horário de funcionamento não encontrado") }
        }

        val empresa = Empresa(
            codigo = 0,
            nome = dto.nome,
            contato = dto.contato,
            CNPJ = dto.CNPJ,
            endereco = endereco,
            horarioFuncionamento = horarioFuncionamento
        )
        empresaRepository.save(empresa)
        return EmpresaResponseDTO(
            codigo = empresa.codigo,
            nome = empresa.nome,
            contato = empresa.contato,
            CNPJ = empresa.CNPJ,
            enderecoId = empresa.endereco.codigo!!,
            horarioFuncionamentoId = empresa.horarioFuncionamento?.codigo
        )
    }

    fun excluirEmpresaPorCNPJ(cnpj: String): String {
        empresaRepository.deleteByCNPJ(cnpj)
        return "Empresa com CNPJ $cnpj excluída com sucesso"
    }

    fun listarEmpresas(): List<EmpresaResponseDTO> {
        val empresas = empresaRepository.findAll()
        return empresas.map { empresa ->
            EmpresaResponseDTO(
                codigo = empresa.codigo,
                nome = empresa.nome,
                contato = empresa.contato,
                CNPJ = empresa.CNPJ,
                enderecoId = empresa.endereco.codigo!!,
                horarioFuncionamentoId = empresa.horarioFuncionamento?.codigo
            )
        }
    }

    fun filtrarPorNome(nome: String): List<EmpresaResponseDTO> {
        val empresas = empresaRepository.findByNomeContainsIgnoreCase(nome)
        return empresas.map { empresa ->
            EmpresaResponseDTO(
                codigo = empresa.codigo,
                nome = empresa.nome,
                contato = empresa.contato,
                CNPJ = empresa.CNPJ,
                enderecoId = empresa.endereco.codigo!!,
                horarioFuncionamentoId = empresa.horarioFuncionamento?.codigo
            )
        }
    }

    fun filtrarPorCnpj(cnpj: String): List<EmpresaResponseDTO> {
        val empresas = empresaRepository.findByCNPJ(cnpj)
        return empresas.map { empresa ->
            EmpresaResponseDTO(
                codigo = empresa.codigo,
                nome = empresa.nome,
                contato = empresa.contato,
                CNPJ = empresa.CNPJ,
                enderecoId = empresa.endereco.codigo!!,
                horarioFuncionamentoId = empresa.horarioFuncionamento?.codigo
            )
        }
    }

    fun atualizarEmpresa(nome: String, dto: EmpresaUpdateDTO): EmpresaResponseDTO? {
        val empresa = empresaRepository.buscarPeloNomeIgnoreCase(nome) ?: return null
        dto.nome?.let { empresa.nome = it }
        dto.contato?.let { empresa.contato = it }
        dto.CNPJ?.let { empresa.CNPJ = it }
        dto.enderecoId?.let {
            val endereco = enderecoRepository.findById(it)
                .orElseThrow { IllegalArgumentException("Endereço não encontrado") }
            empresa.endereco = endereco
        }
        dto.horarioFuncionamentoId?.let {
            val horarioFuncionamento = horarioFuncionamentoRepository.findById(it)
                .orElseThrow { IllegalArgumentException("Horário de funcionamento não encontrado") }
            empresa.horarioFuncionamento = horarioFuncionamento
        }
        empresaRepository.save(empresa)
        return EmpresaResponseDTO(
            codigo = empresa.codigo,
            nome = empresa.nome,
            contato = empresa.contato,
            CNPJ = empresa.CNPJ,
            enderecoId = empresa.endereco.codigo!!,
            horarioFuncionamentoId = empresa.horarioFuncionamento?.codigo
        )
    }

    fun editarHorarioFuncionamento(cnpj: String, dto: EmpresaUpdateDTO): EmpresaResponseDTO? {
        val empresa = empresaRepository.buscarPeloCNPJ(cnpj) ?: return null
        dto.horarioFuncionamentoId?.let {
            val horarioFuncionamento = horarioFuncionamentoRepository.findById(it)
                .orElseThrow { IllegalArgumentException("Horário de funcionamento não encontrado") }
            empresa.horarioFuncionamento = horarioFuncionamento
        }
        empresaRepository.save(empresa)
        return EmpresaResponseDTO(
            codigo = empresa.codigo,
            nome = empresa.nome,
            contato = empresa.contato,
            CNPJ = empresa.CNPJ,
            enderecoId = empresa.endereco.codigo!!,
            horarioFuncionamentoId = empresa.horarioFuncionamento?.codigo
        )
    }

    fun editarEndereco(cnpj: String, dto: EmpresaUpdateDTO): EmpresaResponseDTO? {
        val empresa = empresaRepository.buscarPeloCNPJ(cnpj) ?: return null
        dto.enderecoId?.let {
            val endereco = enderecoRepository.findById(it)
                .orElseThrow { IllegalArgumentException("Endereço não encontrado") }
            empresa.endereco = endereco
        }
        empresaRepository.save(empresa)
        return EmpresaResponseDTO(
            codigo = empresa.codigo,
            nome = empresa.nome,
            contato = empresa.contato,
            CNPJ = empresa.CNPJ,
            enderecoId = empresa.endereco.codigo!!,
            horarioFuncionamentoId = empresa.horarioFuncionamento?.codigo
        )
    }
}

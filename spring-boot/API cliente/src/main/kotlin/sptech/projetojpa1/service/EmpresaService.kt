package sptech.projetojpa1.service

import org.springframework.stereotype.Service
import sptech.projetojpa1.domain.Empresa
import sptech.projetojpa1.domain.Usuario
import sptech.projetojpa1.dto.empresa.EmpresaRequestDTO
import sptech.projetojpa1.dto.empresa.EmpresaResponseDTO
import sptech.projetojpa1.dto.empresa.EmpresaUpdateDTO
import sptech.projetojpa1.repository.EmpresaRepository
import sptech.projetojpa1.repository.EnderecoRepository
import sptech.projetojpa1.repository.HorarioFuncionamentoRepository
import sptech.projetojpa1.repository.UsuarioRepository

@Service
class EmpresaService(
    private val empresaRepository: EmpresaRepository,
    private val enderecoRepository: EnderecoRepository,
    private val horarioFuncionamentoRepository: HorarioFuncionamentoRepository,
    private val usuarioRepository: UsuarioRepository // Adicione o repositório de usuário aqui
) {

    fun listarEmpresas(): List<EmpresaResponseDTO> {
        return empresaRepository.findAll().map { it.toResponseDTO() }
    }

    fun listarPorCnpj(cnpj: String): EmpresaResponseDTO? {
        val empresa = empresaRepository.findByCnpj(cnpj)
            ?: throw IllegalArgumentException("Empresa com CNPJ $cnpj não encontrada")
        return empresa.toResponseDTO()
    }

    fun criarEmpresa(dto: EmpresaRequestDTO): EmpresaResponseDTO {
        val endereco = enderecoRepository.findById(dto.enderecoId)
            .orElseThrow { IllegalArgumentException("Endereço não encontrado") }

        val horarioFuncionamento = horarioFuncionamentoRepository.findById(dto.horarioFuncionamentoId)
            .orElseThrow { IllegalArgumentException("Horário de funcionamento não encontrado") }

        val empresa = Empresa(
            idEmpresa = 0,
            nome = dto.nome,
            telefone = dto.telefone,
            cnpj = dto.cnpj,
            endereco = endereco,
            horarioFuncionamento = horarioFuncionamento
        )
        empresaRepository.save(empresa)
        return empresa.toResponseDTO()
    }

    fun atualizarEmpresa(cpf: String, dto: EmpresaUpdateDTO): EmpresaResponseDTO? {
        val usuario = usuarioRepository.findByCpf(cpf)
            ?: throw IllegalArgumentException("Usuário com CPF $cpf não encontrado")

        val empresa = empresaRepository.findById(
            usuario.empresa?.idEmpresa ?: throw IllegalArgumentException("Empresa não encontrada")
        ).orElseThrow { IllegalArgumentException("Empresa não encontrada") }

        dto.nome?.let { empresa.nome = it }
        dto.telefone?.let { empresa.telefone = it }
        dto.cnpj?.let { empresa.cnpj = it }
        dto.idEndereco?.let {
            val endereco = enderecoRepository.findById(it)
                .orElseThrow { IllegalArgumentException("Endereço não encontrado") }
            empresa.endereco = endereco
        }
        dto.idHorarioFuncionamento?.let {
            val horarioFuncionamento = horarioFuncionamentoRepository.findById(it)
                .orElseThrow { IllegalArgumentException("Horário de funcionamento não encontrado") }
            empresa.horarioFuncionamento = horarioFuncionamento
        }

        empresaRepository.save(empresa)
        return empresa.toResponseDTO()
    }

    fun deletarEmpresa(cnpj: String): String {
        empresaRepository.deleteByCnpj(cnpj)
        return "Empresa com CNPJ $cnpj excluída com sucesso"
    }

    private fun Empresa.toResponseDTO() = EmpresaResponseDTO(
        idEmpresa = this.idEmpresa,
        nome = this.nome,
        telefone = this.telefone,
        cnpj = this.cnpj,
        endereco = this.endereco,
        horarioFuncionamento = this.horarioFuncionamento
    )
}
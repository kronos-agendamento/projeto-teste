document.addEventListener("DOMContentLoaded", function () {
    const procedimentoSelect = document.getElementById('procedimento');
    const tipoAtendimentoCilios = document.getElementById('tipo-atendimento-cilios');
    const tipoAtendimentoMaquiagem = document.getElementById('tipo-atendimento-maquiagem');
    const opcaoCilios = document.getElementById('opcao-cilios');
    const opcaoSobrancelha = document.getElementById('opcao-sobrancelha');
    const opcaoMaquiagem = document.getElementById('opcao-maquiagem');
    const endereco = document.getElementById('endereco');
    const dias = document.getElementById('dias');
    const horarios = document.getElementById('horarios');
    const botaoAgendar = document.getElementById('button-alterar');

    // Função para resetar os campos ao mudar de seleção
    function resetarCampos() {
        tipoAtendimentoCilios.classList.add('hidden');
        tipoAtendimentoMaquiagem.classList.add('hidden');
        opcaoCilios.classList.add('hidden');
        opcaoSobrancelha.classList.add('hidden');
        opcaoMaquiagem.classList.add('hidden');
        endereco.classList.add('hidden');
        dias.classList.add('hidden');
        horarios.classList.add('hidden');
        botaoAgendar.classList.add('hidden');
    }

    // Função para mostrar dias
    function mostrarDias() {
        dias.classList.remove('hidden'); // Exibe os dias
    }

    // Função para mostrar horários e botão de agendamento após a seleção dos dias
    function mostrarConclusao() {
        horarios.classList.remove('hidden'); // Exibe os horários
        botaoAgendar.classList.remove('hidden'); // Exibe o botão de agendamento
    }

    // Função principal para lidar com a seleção de Procedimento
    procedimentoSelect.addEventListener('change', function () {
        resetarCampos();
        const procedimentoSelecionado = procedimentoSelect.value;

        if (procedimentoSelecionado === 'cilios') {
            opcaoCilios.classList.remove('hidden'); // Exibe opções de cílios
            tipoAtendimentoCilios.classList.remove('hidden'); // Mostra as opções de atendimento para cílios

            // Evento para mostrar dias após selecionar tipo de atendimento
            tipoAtendimentoCilios.querySelector('select').addEventListener('change', function () {
                const tipoAtendimentoSelecionado = tipoAtendimentoCilios.querySelector('select').value;

                if (tipoAtendimentoSelecionado === 'retirada') {
                    mostrarDias(); // Mostra dias
                    dias.querySelector('select').addEventListener('change', mostrarConclusao); // Adiciona evento para mostrar horários
                } else if (tipoAtendimentoSelecionado !== '') {
                    mostrarDias(); // Mostra dias
                    dias.querySelector('select').addEventListener('change', mostrarConclusao); // Adiciona evento para mostrar horários
                }
            });
        } else if (procedimentoSelecionado === 'sobrancelha') {
            opcaoSobrancelha.classList.remove('hidden'); // Exibe opções de sobrancelha diretamente
            mostrarDias(); // Mostra dias
            dias.querySelector('select').addEventListener('change', mostrarConclusao); // Adiciona evento para mostrar horários
        } else if (procedimentoSelecionado === 'maquiagem') {
            tipoAtendimentoMaquiagem.classList.remove('hidden'); // Mostra as opções de atendimento para maquiagem
            opcaoMaquiagem.classList.remove('hidden'); // Exibe opções de maquiagem

            // Evento para mostrar dias após selecionar tipo de atendimento
            tipoAtendimentoMaquiagem.querySelector('select').addEventListener('change', function () {
                const tipoAtendimentoSelecionado = tipoAtendimentoMaquiagem.querySelector('select').value;

                if (tipoAtendimentoSelecionado === 'salao') {
                    endereco.classList.add('hidden'); // Esconde o campo de endereço se "salão" for selecionado
                } else {
                    endereco.classList.remove('hidden'); // Exibe o campo de endereço se não for "salão"
                }

                if (tipoAtendimentoSelecionado !== '') {
                    mostrarDias(); // Mostra dias
                    dias.querySelector('select').addEventListener('change', mostrarConclusao); // Adiciona evento para mostrar horários
                }
            });
        }
    });

});
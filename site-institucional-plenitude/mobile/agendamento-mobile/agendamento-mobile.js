document.addEventListener("DOMContentLoaded", function () {
    const procedimentoSelect = document.getElementById('procedimento');
    const tipoAtendimentoCilios = document.getElementById('tipo-atendimento-cilios');
    const tipoAtendimentoMaquiagem = document.getElementById('tipo-atendimento-maquiagem');
    const opcaoCilios = document.getElementById('opcao-cilios');
    const opcaoSobrancelha = document.getElementById('opcao-sobrancelha');
    const opcaoMaquiagem = document.getElementById('opcao-maquiagem');
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
        if (!dias.classList.contains('hidden')) {
            horarios.classList.remove('hidden'); // Exibe os horários
            botaoAgendar.classList.remove('hidden'); // Exibe o botão de agendamento
        }
    }

    // Função principal para lidar com a seleção de Procedimento
    procedimentoSelect.addEventListener('change', function () {
        resetarCampos();
        const procedimentoSelecionado = procedimentoSelect.value;
        const diaSelecionado = dias.value

        if (procedimentoSelecionado === 'cilios') {
            tipoAtendimentoCilios.classList.remove('hidden'); // Mostra as opções de atendimento para cílios
            tipoAtendimentoCilios.querySelector('select').addEventListener('change', function () {
                const tipoAtendimentoSelecionado = tipoAtendimentoCilios.querySelector('select').value;

                if (tipoAtendimentoSelecionado === 'retirada') {
                    mostrarDias(); // Mostra dias
                    // Adiciona evento para mostrar horários e botão após selecionar dias
                    if(diaSelecionado !== ''){ dias.querySelector('select').addEventListener('change', function () {
                        mostrarConclusao(); // Mostra horários e botão de agendamento
                    });}
                } else if (tipoAtendimentoSelecionado !== '') {
                    opcaoCilios.classList.remove('hidden'); // Exibe opções de cílios se não for "Retirada"
                    mostrarDias(); // Mostra dias
                    // Adiciona evento para mostrar horários e botão após selecionar dias
                    if(diaSelecionado !== ''){ dias.querySelector('select').addEventListener('change', function () {
                        mostrarConclusao(); // Mostra horários e botão de agendamento
                    });}
                   
                }
            });
        } else if (procedimentoSelecionado === 'sobrancelha') {
            opcaoSobrancelha.classList.remove('hidden'); // Exibe opções de sobrancelha diretamente
            mostrarDias(); // Mostra dias
            // Adiciona evento para mostrar horários e botão após selecionar dias
            dias.querySelector('select').addEventListener('change', function () {
                mostrarConclusao(); // Mostra horários e botão de agendamento
            });
        } else if (procedimentoSelecionado === 'maquiagem') {
            tipoAtendimentoMaquiagem.classList.remove('hidden'); // Mostra as opções de atendimento para maquiagem
            tipoAtendimentoMaquiagem.querySelector('select').addEventListener('change', function () {
                const tipoAtendimentoSelecionado = tipoAtendimentoMaquiagem.querySelector('select').value;

                if (tipoAtendimentoSelecionado !== '') {
                    opcaoMaquiagem.classList.remove('hidden'); // Exibe opções de maquiagem
                    mostrarDias(); // Mostra dias
                    // Adiciona evento para mostrar horários e botão após selecionar dias
                    dias.querySelector('select').addEventListener('change', function () {
                        mostrarConclusao(); // Mostra horários e botão de agendamento
                    });
                }
            });
        }
    });
});

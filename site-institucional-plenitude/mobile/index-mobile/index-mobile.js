// Usar o idUsuario dinamicamente na URL do endpoint
const usuarioId = localStorage.getItem('idUsuario');
const agendamentoId = localStorage.getItem('idAgendamento')
const apiUrl = `http://localhost:8080/api/agendamentos/agendamentos/usuario/${usuarioId}`;


// Função para formatar a data
function formatarData(dataHora) {
    const data = new Date(dataHora);
    return data.toLocaleDateString() + ' às ' + data.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Função para buscar os dados do usuário
async function buscarDadosUsuario() {
  const usuarioId = localStorage.getItem("idUsuario");
  if (!usuarioId) {
      console.log("Nenhum ID de usuário encontrado no localStorage.");
      return null;
  }

  try {
      const response = await fetch(`http://localhost:8080/usuarios/${usuarioId}`);
      if (!response.ok) {
          throw new Error("Erro ao buscar dados do usuário.");
      }
      const usuario = await response.json();

      // Armazena os dados no localStorage para garantir consistência
      localStorage.setItem('dataNasc', usuario.dataNasc || "");
      localStorage.setItem('genero', usuario.genero || "");
      localStorage.setItem('indicacao', usuario.indicacao || "");
      localStorage.setItem('logradouro', usuario.endereco?.logradouro || "");
      localStorage.setItem('cep', usuario.endereco?.cep || "");
      localStorage.setItem('bairro', usuario.endereco?.bairro || "");
      localStorage.setItem('cidade', usuario.endereco?.cidade || "");
      localStorage.setItem('estado', usuario.endereco?.estado || "");
      localStorage.setItem('numero', usuario.endereco?.numero || "");
      localStorage.setItem('numero', usuario.endereco?.complemento || "");




     console.log("Dados do usuário obtidos e armazenados no localStorage:", usuario);

      // Preenche os campos do formulário com os dados do localStorage
      document.getElementById('nascimento').value = localStorage.getItem('dataNasc');
      document.getElementById('genero').value = localStorage.getItem('genero'); // Preenche o campo de gênero
      document.getElementById('indicacao').value = localStorage.getItem('indicacao');
      document.getElementById('logradouro').value = localStorage.getItem('logradouro');
      document.getElementById('cep').value = localStorage.getItem('cep');
      document.getElementById('bairro').value = localStorage.getItem('bairro');
      document.getElementById('cidade').value = localStorage.getItem('cidade');
      document.getElementById('estado').value = localStorage.getItem('estado');
      document.getElementById('numero').value = localStorage.getItem('numero');
      document.getElementById('complemento').value = localStorage.getItem('complemento');

      return usuario;
  } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
      return null;
  }
}


// Função para verificar se os campos obrigatórios do usuário estão preenchidos
function verificarDadosIncompletos(usuario) {
  const camposObrigatorios = [
      usuario.dataNasc,
      usuario.genero,
      usuario.indicacao,
      usuario.endereco?.logradouro,
      usuario.endereco?.cep,
      usuario.endereco?.bairro,
      usuario.endereco?.cidade,
      usuario.endereco?.estado,
      usuario.endereco?.numero,
  ];

  // Verifica se algum campo obrigatório está vazio ou nulo
  const incompletos = camposObrigatorios.some(campo => !campo || campo === "");
  console.log("Verificando se há dados incompletos:", incompletos);
  return incompletos;
}

// Verifica se os dados do usuário no localStorage estão completos
function verificarDadosLocalStorage() {
  const camposObrigatoriosLocalStorage = [
      localStorage.getItem('dataNasc'),
      localStorage.getItem('genero'),
      localStorage.getItem('indicacao'),
      localStorage.getItem('logradouro'),
      localStorage.getItem('cep'),
      localStorage.getItem('bairro'),
      localStorage.getItem('cidade'),
      localStorage.getItem('estado'),
      localStorage.getItem('numero'),
  ];

  const completos = camposObrigatoriosLocalStorage.every(campo => campo && campo !== "");
  console.log("Verificando dados do localStorage. Estão completos?", completos);
  console.log("Dados no localStorage:", camposObrigatoriosLocalStorage);
  return completos;
}

// Função para exibir o modal de cadastro se os dados estiverem incompletos
function iniciarExibicaoModal() {
  const dadosIncompletos = !verificarDadosLocalStorage();  // Verificar localStorage
  
  if (dadosIncompletos) {
      console.log("Dados incompletos detectados. Exibindo modal.");
      exibirModal();  // Exibe o modal se os dados estiverem incompletos
  } else {
      console.log("Todos os dados estão completos. Fechando modal.");
      fecharModal();  // Caso os dados estejam completos, fecha o modal
  }
}

// Função para exibir o modal
function exibirModal() {
  const modalCadastro = document.getElementById("modal-cadastro");
  modalCadastro.style.display = "block";
  console.log("Modal exibido.");
}

document.addEventListener('DOMContentLoaded', function() {
  const modalCloseButton = document.getElementById('modal-close');
  
  // Verifica se o elemento com ID 'modal-close' existe
  if (modalCloseButton) {
      modalCloseButton.addEventListener('click', fecharModal);
      console.log("Evento de fechamento do modal adicionado.");
  } else {
      console.error("Elemento com ID 'modal-close' não encontrado.");
  }
  new window.VLibras.Widget('https://vlibras.gov.br/app');
});

// Função para fechar o modal
function fecharModal() {
  const modal = document.getElementById('modal-cadastro');
  if (modal) {
      modal.style.display = 'none';
      console.log("Modal fechado.");
  } else {
      console.error("Modal não encontrado.");
  }
}


// Função para criar os elementos de agendamento no DOM
function criarAgendamento(agendamento, isAnterior = false) {
    const boxAgendamento = document.createElement('div');
    boxAgendamento.classList.add('box-agendamento');

    // Criação do círculo branco com o ícone menor dentro
    const iconAgendamento = document.createElement('div');
    iconAgendamento.classList.add('icon-procedimento');
    iconAgendamento.style.backgroundColor = '#ffffff';
    iconAgendamento.style.border = '2px solid #AD9393';
    iconAgendamento.style.width = '80px';
    iconAgendamento.style.height = '80px';
    iconAgendamento.style.marginTop = '10px';

    const imgIcon = document.createElement('img');

    // Verifica o tipo de procedimento e ajusta o ícone
    switch (agendamento.tipoProcedimento) {
        case 'Maquiagem':
            imgIcon.src = '../../assets/icons/maquiagem-mobile.png';
            break;
        case 'Cílios':
            imgIcon.src = '../../assets/icons/cilios-mobile.png';
            break;
        case 'Sobrancelha':
            imgIcon.src = '../../assets/icons/sobrancelha-mobile.png';
            break;
        default:
            imgIcon.src = '../../assets/icons/profile.png'; // Ícone padrão
            break;
    }

    imgIcon.alt = agendamento.tipoProcedimento;
    imgIcon.classList.add('procedimento-icon'); // Classe para ajustar o tamanho do ícone
    iconAgendamento.appendChild(imgIcon);

    const procedimentoAgendamento = document.createElement('div');
    procedimentoAgendamento.classList.add('procedimento-agendamento');

    const dataSpan = document.createElement('span');
    dataSpan.textContent = formatarData(agendamento.dataAgendamento);
    dataSpan.style.fontWeight = 'bold';
    dataSpan.style.fontSize = '15px';

    const tipoSpan = document.createElement('span');
    tipoSpan.textContent = `${agendamento.tipoProcedimento} - ${agendamento.especificacaoProcedimento}`;
    tipoSpan.style.fontSize = '13px';

    procedimentoAgendamento.appendChild(dataSpan);
    procedimentoAgendamento.appendChild(tipoSpan);

    const buttonFlex = document.createElement('div');
    buttonFlex.classList.add('button-flex');

    // Botão de mais informações (três pontinhos) para todos os agendamentos
    const detalhesButton = document.createElement('button');
    detalhesButton.classList.add('edit');
    const detalhesImg = document.createElement('img');
    detalhesImg.src = '../../assets/icons/mais-tres-pontos-indicador.png';
    detalhesImg.alt = 'detalhes';
    detalhesButton.appendChild(detalhesImg);
    buttonFlex.appendChild(detalhesButton);

    // Evento de abrir modal ao clicar em "detalhes"
    detalhesButton.addEventListener('click', function() {
        abrirModalAgendamento(agendamento);
    });

    if (!isAnterior) {
        // Agendamentos futuros também têm botão de deletar e editar
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('edit');
        deleteButton.setAttribute('data-id', agendamento.idAgendamento);

        // Adicionar evento ao botão para mostrar o modal de exclusão
        deleteButton.addEventListener('click', function () {
            document.getElementById('deleteModal').style.display = 'flex';

            // Captura o ID do agendamento do botão
            const agendamentoId = this.getAttribute('data-id');

            document.getElementById('confirmDeleteButton').addEventListener('click', function () {
                // Usa o ID capturado na URL
                fetch(`http://localhost:8080/api/agendamentos/excluir/${agendamentoId}`, {
                    method: 'DELETE',
                })
                .then(response => {
                    if (response.ok) {
                        showNotification("Agendamento excluído com sucesso!");
                        setTimeout(() => {
                          window.location.reload();
                      }, 2000);
                    } else {
                        showNotification("Erro ao excluir o agendamento. Tente novamente.", true);
                    }
                })
                .catch(error => {
                    showNotification("Agendamento excluído com sucesso!");
                });

                // Fechar o modal após confirmar
                document.getElementById('deleteModal').style.display = 'none';
            });
        });

        const deleteImg = document.createElement('img');
        deleteImg.src = '../../assets/icons/excluir.png';
        deleteImg.alt = 'delete';
        deleteButton.appendChild(deleteImg);
        buttonFlex.appendChild(deleteButton);

        const editButton = document.createElement('button');
        editButton.classList.add('edit');
        const editImg = document.createElement('img');
        editImg.src = '../../assets/icons/pen.png';
        editImg.alt = 'edit';
        editButton.appendChild(editImg);

        editButton.addEventListener('click', function() {
            const agendamentoId = agendamento.idAgendamento;
            const usuarioId = agendamento.usuarioId;
            const fkProcedimento = agendamento.fkProcedimento;
            const fkEspecificacao = agendamento.fkEspecificacao;
            window.location.href = `reagendarForms/reagendar-mobile.html?id=${agendamentoId}&idUsuario=${usuarioId}&fkProcedimento=${fkProcedimento}&fkEspecificacao=${fkEspecificacao}`;
        });
        buttonFlex.appendChild(editButton);
    }

    boxAgendamento.appendChild(iconAgendamento);
    boxAgendamento.appendChild(procedimentoAgendamento);
    boxAgendamento.appendChild(buttonFlex);

    return boxAgendamento;
}

document.addEventListener('DOMContentLoaded', function() {
  const modalCloseButton = document.getElementById('modal-close');
  
  if (modalCloseButton) {
      modalCloseButton.addEventListener('click', fecharModal);
      console.log("Evento de fechamento do modal adicionado.");
  } else {
      console.error("Elemento com ID 'modal-close' não encontrado.");
  }
});


function showNotification(message, isError = false) {
    const notification = document.getElementById("notification");
    const notificationMessage = document.getElementById("notification-message");
    
    // Define a mensagem
    notificationMessage.textContent = message;

    // Define se é um erro ou não
    if (isError) {
        notification.classList.add("error");
    } else {
        notification.classList.remove("error");
    }

    // Exibe a notificação adicionando a classe "show"
    notification.classList.add("show");


    // Remove a notificação após 10 segundos (10000 milissegundos)
    notificationTimeout = setTimeout(() => {
        notification.classList.remove("show");
    }, 3000); 
}

// Função para carregar e processar agendamentos
async function carregarAgendamentos() {
    try {
        const response = await fetch(apiUrl);
        const agendamentos = await response.json();

        const containerFuturos = document.getElementById('agendamentos-futuros');
        const containerAnteriores = document.getElementById('agendamentos-anteriores');
        const verTodosLink = document.getElementById('ver-todos-link');

        containerFuturos.innerHTML = '';
        containerAnteriores.innerHTML = '';

        const agora = new Date(); // Data e hora atuais
        let agendamentosAnteriores = [];
        let agendamentosFuturos = [];

        agendamentos.forEach(agendamento => {
            const dataAgendamento = new Date(agendamento.dataAgendamento);

            // Verifica se o agendamento é de hoje e se o horário já passou
            const ehHoje = dataAgendamento.toDateString() === agora.toDateString();
            const jaPassou = ehHoje && dataAgendamento < agora;

            if (dataAgendamento >= agora && !jaPassou) {
                // Agendamentos futuros
                agendamentosFuturos.push(agendamento);
            } else {
                // Agendamentos anteriores ou realizados hoje
                agendamentosAnteriores.push(agendamento);
            }
        });

        // Ordenar agendamentos futuros em ordem crescente
        agendamentosFuturos.sort((a, b) => new Date(a.dataAgendamento) - new Date(b.dataAgendamento));

        // Exibir agendamentos futuros
        agendamentosFuturos.forEach(agendamento => {
            const agendamentoElement = criarAgendamento(agendamento);
            containerFuturos.appendChild(agendamentoElement);
        });

        // Exibir os 3 primeiros agendamentos anteriores
        agendamentosAnteriores.slice(0, 3).forEach(agendamento => {
            const agendamentoElement = criarAgendamento(agendamento, true);
            containerAnteriores.appendChild(agendamentoElement);
        });

        // Evento do botão "Ver todos"
        verTodosLink.addEventListener('click', (e) => {
            e.preventDefault();
            containerAnteriores.innerHTML = ''; // Limpa os atuais
            agendamentosAnteriores.forEach(agendamento => {
                const agendamentoElement = criarAgendamento(agendamento, true);
                containerAnteriores.appendChild(agendamentoElement); // Exibe todos
            });
            verTodosLink.style.display = 'none'; // Esconde o link após exibir todos
        });

    } catch (error) {
        console.error('Erro ao carregar agendamentos:', error);
    }
}

// Chama a função ao carregar a página
document.addEventListener('DOMContentLoaded', carregarAgendamentos);

function abrirModalAgendamento(agendamento) {
    // Seleciona o modal pelo ID
    const modal = document.getElementById('modal-agendamento');
    
    // Seleciona os elementos dentro do modal onde você exibirá as informações
    const modalData = document.getElementById('modal-data');
    const modalHorario = document.getElementById('modal-horario');
    const modalDiaSemana = document.getElementById('modal-dia-semana');
    const modalProcedimento = document.getElementById('modal-procedimento');
    const modalEspecificacao = document.getElementById('modal-especificacao');
    const modalProfissional = document.getElementById('modal-profissional');
    const modalLocal = document.getElementById('modal-local');
    const modalStatus = document.getElementById('modal-status');

    // Função para formatar data e horário
    const formatarData = (data) => {
        const optionsData = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        const optionsHorario = { hour: '2-digit', minute: '2-digit' };

        const dataObj = new Date(data);
        
        const diaSemana = dataObj.toLocaleDateString('pt-BR', { weekday: 'long' });
        const diaMesAno = dataObj.toLocaleDateString('pt-BR', optionsData);
        const horario = dataObj.toLocaleTimeString('pt-BR', optionsHorario);

        return { diaSemana, diaMesAno, horario };
    };

    const dataFormatada = formatarData(agendamento.dataAgendamento);

    // Atualiza os elementos com os dados do agendamento clicado
    // modalDiaSemana.textContent = dataFormatada.diaSemana;
    modalData.innerHTML = `<i class="fas fa-calendar-alt"></i> <strong>Data:</strong> ${dataFormatada.diaMesAno}`;
    modalHorario.innerHTML = `<i class="fas fa-clock"></i> <strong>Horário:</strong> ${dataFormatada.horario}`;
    modalProcedimento.innerHTML = `<i class="fas fa-star"></i> <strong>Procedimento:</strong> ${agendamento.tipoProcedimento}`;
    modalEspecificacao.innerHTML = `<i class="fas fa-list"></i> <strong>Especificação:</strong> ${agendamento.especificacaoProcedimento}`;
    modalProfissional.innerHTML = `<i class="fas fa-user-md"></i> <strong>Profissional:</strong> Priscila Rossato`;
    modalLocal.innerHTML = `<i class="fas fa-map-marker-alt"></i> <strong>Local:</strong> R. das Gilias, 361 - Vila Bela, São Paulo - SP, 03201-070`;
    modalStatus.innerHTML = `<i class="fas fa-tasks"></i> <strong>Status:</strong> ${agendamento.statusAgendamento} `;
    
    // Exibe o modal
    modal.style.display = 'block';
}

// Função para fechar o modal
function fecharModal() {
    const modal = document.getElementById('modal-agendamento');
    modal.style.display = 'none';
}

// Função para fechar o modal
function fecharModalDecisao() {
    const modal = document.getElementById('deleteModal');
    modal.style.display = 'none';
}



// Chama a função ao carregar a página
document.addEventListener('DOMContentLoaded', carregarAgendamentos);

document.addEventListener('DOMContentLoaded', function() {

    const increaseFontBtn = document.getElementById('increase-font');
    const decreaseFontBtn = document.getElementById('decrease-font');
    const rootElement = document.documentElement;

    // Definir tamanho de fonte padrão ou carregar do localStorage
    let currentFontSize = localStorage.getItem('fontSize') || '16px';
    rootElement.style.setProperty('--font-size-default', currentFontSize);
    document.body.style.fontSize = currentFontSize; // Aplicar o tamanho de fonte ao body

    const defaultFontSize = parseFloat(currentFontSize); // Tamanho inicial de referência
    let currentIncrease = 0; // Contador de aumentos
    let currentDecrease = 0; // Contador de diminuições
    const maxAdjustments = 2; // Limitar o número de vezes que o tamanho da fonte pode ser alterado

    // Função para aumentar o tamanho da fonte
    increaseFontBtn.addEventListener('click', function() {
        if (currentIncrease < maxAdjustments) {
            let newSize = parseFloat(currentFontSize) + 2; // Aumentar de 2px
            currentFontSize = `${newSize}px`;
            rootElement.style.setProperty('--font-size-default', currentFontSize);
            document.body.style.fontSize = currentFontSize; // Aplicar o novo tamanho ao body
            localStorage.setItem('fontSize', currentFontSize);
            
            currentIncrease++; // Incrementar o contador de aumentos
            currentDecrease = 0; // Resetar o contador de diminuições para permitir novo ciclo
        }
    });

    // Função para diminuir o tamanho da fonte
    decreaseFontBtn.addEventListener('click', function() {
        if (currentDecrease < maxAdjustments) {
            let newSize = parseFloat(currentFontSize) - 2; // Diminuir de 2px
            if (newSize >= defaultFontSize - 4) {  // Limitar a diminuição a 4px abaixo do tamanho inicial
                currentFontSize = `${newSize}px`;
                rootElement.style.setProperty('--font-size-default', currentFontSize);
                document.body.style.fontSize = currentFontSize; // Aplicar o novo tamanho ao body
                localStorage.setItem('fontSize', currentFontSize);
                
                currentDecrease++; // Incrementar o contador de diminuições
                currentIncrease = 0; // Resetar o contador de aumentos para permitir novo ciclo
            }
        }
    });
});

function saudacao() {
  const saudacaoElement1 = document.getElementById('saudacao-texto');  // Para o texto de saudação
  const saudacaoElement2 = document.getElementById('greeting2');  // Para o segundo texto
  const userNameSpan = document.getElementById('userNameSpan');  // Para o nome do usuário

  // Obter o nome do usuário do localStorage
  let nomeUsuario = localStorage.getItem('nome') || 'Usuário';  // Caso não exista, exibe "Usuário" como padrão

  // Pegar apenas o primeiro nome
  nomeUsuario = nomeUsuario.split(' ')[0];  // Divide o nome completo em partes e pega a primeira

  // Exibe o primeiro nome do usuário
  userNameSpan.textContent = nomeUsuario;

  const dataAtual = new Date();
  const horaAtual = dataAtual.getHours();
  const diaSemana = dataAtual.getDay();

  let saudacaoTexto;
  let diasDaSemana = [
    { nome: "Domingo", genero: "um", otimo: "ótimo" },
    { nome: "Segunda-feira", genero: "uma", otimo: "ótima" },
    { nome: "Terça-feira", genero: "uma", otimo: "ótima" },
    { nome: "Quarta-feira", genero: "uma", otimo: "ótima" },
    { nome: "Quinta-feira", genero: "uma", otimo: "ótima" },
    { nome: "Sexta-feira", genero: "uma", otimo: "ótima" },
    { nome: "Sábado", genero: "um", otimo: "ótimo" }
  ];

  // Verifica a hora do dia para a saudação
  if (horaAtual >= 0 && horaAtual < 12) {
    saudacaoTexto = "Bom dia,";
  } else if (horaAtual >= 12 && horaAtual < 18) {
    saudacaoTexto = "Boa tarde,";
  } else {
    saudacaoTexto = "Boa noite,";
  }

  // Define o gênero correto para o "um/uma" de acordo com o dia da semana
  const dia = diasDaSemana[diaSemana];
  const genero = dia.genero;
  const otimo = dia.otimo;

  // Exibe a saudação com o dia da semana e o gênero correto
  saudacaoElement1.textContent = saudacaoTexto;
  saudacaoElement2.textContent = `Tenha ${genero} ${otimo} ${dia.nome}!`;
}

// Certifique-se de chamar a função quando a página carregar
document.addEventListener('DOMContentLoaded', saudacao);

// Certifique-se de chamar a função quando a página carregar
document.addEventListener('DOMContentLoaded', saudacao);


// Certifique-se de chamar a função quando a página carregar
document.addEventListener('DOMContentLoaded', saudacao);


  // Função para normalizar strings (remover acentos e converter para minúsculas)
  function normalizeString(str) {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }

  // Função para carregar especificações
  function carregarEspecificacoes() {
    fetch("http://localhost:8080/api/especificacoes")
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else if (response.status === 204) {
          console.log("Nenhuma especificação encontrada.");
          return [];
        } else {
          throw new Error("Erro ao carregar especificações");
        }
      })
      .then((data) => {
        console.log("Especificações carregadas:", data);
        const dataList = document.getElementById("especificacoesList");
        dataList.innerHTML = ""; // Limpa as opções anteriores

        // Ordena as especificações antes de adicioná-las ao datalist
        data.sort((a, b) => {
          const normalizedA = normalizeString(
            `${a.especificacao} - ${a.procedimento.tipo}`
          );
          const normalizedB = normalizeString(
            `${b.especificacao} - ${b.procedimento.tipo}`
          );
          return normalizedA.localeCompare(normalizedB);
        });

        data.forEach((item) => {
          const option = document.createElement("option");
          option.value = `${item.especificacao} - ${item.procedimento.tipo}`;
          option.dataset.normalized = normalizeString(option.value);
          option.dataset.idEspecificacao = item.idEspecificacaoProcedimento;
          option.dataset.idProcedimento = item.procedimento.idProcedimento;
          dataList.appendChild(option);
        });
      })
      .catch((error) => {
        console.error("Erro:", error);
      });
  }

  // Função para salvar IDs no localStorage e redirecionar para a tela de agendamento
  function salvarIdsNoLocalStorage() {
    const input = document.getElementById("searchInput");
    const selectedOption = Array.from(
      document.getElementById("especificacoesList").options
    ).find((option) => option.value === input.value);

    if (selectedOption) {
      const idEspecificacao = selectedOption.dataset.idEspecificacao;
      const idProcedimento = selectedOption.dataset.idProcedimento;

      localStorage.setItem("idEspecificacao", idEspecificacao);
      localStorage.setItem("idProcedimento", idProcedimento);

      console.log("IDs salvos no localStorage:", {
        idEspecificacao,
        idProcedimento,
      });

      // Redireciona para a tela de agendamento
      window.location.href = "../agendamento-mobile/agendamento-mobile.html";
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput");
  
    if (searchInput) {
      searchInput.addEventListener("change", salvarIdsNoLocalStorage);
    } else {
      console.error("Elemento 'searchInput' não foi encontrado.");
    }
  });
  
  // Função para busca binária
  function buscaBinaria(arr, x) {
    let start = 0;
    let end = arr.length - 1;

    while (start <= end) {
      let mid = Math.floor((start + end) / 2);
      const midVal = arr[mid].dataset.normalized;

      if (midVal.includes(x)) {
        return mid;
      } else if (midVal < x) {
        start = mid + 1;
      } else {
        end = mid - 1;
      }
    }

    return -1;
  }

  // Função para filtrar as opções do datalist usando busca binária
  function filtrarEspecificacoes() {
    const input = document.getElementById("searchInput");
    const filter = normalizeString(input.value);
    const dataList = document.getElementById("especificacoesList");
    const options = Array.from(dataList.getElementsByTagName("option"));

    // Ordena as opções para garantir que a busca binária funcione corretamente
    options.sort((a, b) =>
      a.dataset.normalized.localeCompare(b.dataset.normalized)
    );

    // Realiza a busca binária
    const index = buscaBinaria(options, filter);

    // Exibe apenas as opções que correspondem ao filtro
    options.forEach((option, i) => {
      if (i === index || option.dataset.normalized.includes(filter)) {
        option.style.display = "";
      } else {
        option.style.display = "none";
      }
    });
  }

// Chama a função quando a página carregar
window.onload = saudacao;


document.addEventListener("DOMContentLoaded", async function () {
    const modalCadastro = document.getElementById("modal-cadastro");
    const modalClose = document.getElementById("modal-close");
  

  
    // Função para exibir o modal
    function exibirModal() {
      modalCadastro.style.display = "block";
    }
  
    // Função para fechar o modal
    function fecharModal() {
      modalCadastro.style.display = "none";
    }
  
    // Função para iniciar a exibição do modal a cada 30 segundos
    function iniciarExibicaoModal(usuario) {
      if (verificarDadosIncompletos(usuario)) {
        exibirModal(); // Exibe o modal imediatamente
  
        // Repetição a cada 30 segundos (30.000 ms)
        const modalInterval = setInterval(function () {
          if (verificarDadosIncompletos(usuario)) {
            exibirModal(); // Reexibe o modal se os dados estiverem incompletos
          } else {
            clearInterval(modalInterval); // Para o intervalo se os dados forem completados
          }
        }, 30000); // 30 segundos
      }
    }
  
    // Evento para fechar o modal quando o botão de fechar for clicado
    modalClose.addEventListener("click", fecharModal);
  
  
    // Após carregar a página, buscar dados do usuário e verificar se estão completos
    const usuario = await buscarDadosUsuario();
    if (usuario) {
      iniciarExibicaoModal(usuario);
    }
  });
  


document.addEventListener("DOMContentLoaded", function () {
    // Função para exibir notificação
    function showNotification(message, isError = false) {
      const notification = document.getElementById("notification");
      const notificationMessage = document.getElementById("notification-message");
      notificationMessage.textContent = message;
      if (isError) {
        notification.classList.add("error");
      } else {
        notification.classList.remove("error");
      }
      notification.classList.add("show");
      setTimeout(() => {
        notification.classList.remove("show");
      }, 3000);
    }
  
    // Função para buscar endereço pelo CEP usando a API do ViaCEP
    async function buscarEnderecoPorCep(cep) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        if (!response.ok) {
          throw new Error("Erro ao buscar o endereço pelo CEP");
        }
        const endereco = await response.json();
  
        if (endereco.erro) {
          showNotification("CEP não encontrado.", true);
          limparCamposEndereco();
          return null;
        }
  
        // Preenche os campos de endereço com os dados recebidos
        document.getElementById("logradouro").value = endereco.logradouro || "";
        document.getElementById("bairro").value = endereco.bairro || "";
        document.getElementById("cidade").value = endereco.localidade || "";
        document.getElementById("estado").value = endereco.uf || "";
  
        showNotification("Endereço preenchido com sucesso.");
      } catch (error) {
        console.error("Erro ao buscar o endereço:", error);
        showNotification("Erro ao buscar o endereço. Tente novamente.", true);
        limparCamposEndereco();
      }
    }
  
    // Limpa os campos de endereço caso o CEP seja inválido
    function limparCamposEndereco() {
      document.getElementById("logradouro").value = "";
      document.getElementById("bairro").value = "";
      document.getElementById("cidade").value = "";
      document.getElementById("estado").value = "";
    }
  
    // Evento blur no campo CEP para buscar o endereço
    document.getElementById("cep").addEventListener("blur", function () {
      const cep = this.value.replace(/\D/g, ""); // Remove qualquer caracter não numérico
      if (cep.length === 8) {
        buscarEnderecoPorCep(cep);
      } else {
        showNotification("CEP inválido.", true);
        limparCamposEndereco();
      }
    });
  
    // Função para pegar o CPF da URL
    // function getCpfFromUrl() {
    //   const params = new URLSearchParams(window.location.search) || localStorage.getItem('C');
    //   return params.get("cpf"); // Pega o valor do parâmetro 'cpf' na URL
    // }
  
    // Função de envio do formulário (alterado para PATCH)
    // Função de envio do formulário (alterado para PATCH)
document.getElementById("usuarioForm").addEventListener("submit", async (event) => {
    event.preventDefault();
  
    // Obter o CPF da URL
    const cpf = localStorage.getItem('cpf');;
    if (!cpf) {
      showNotification("CPF não encontrado. Verifique a URL.", true);
      return;
    }
  
    // Pega os valores dos campos
    const dataNasc = document.getElementById("nascimento").value;
    const genero = document.getElementById("genero").value;
    const indicacao = document.getElementById("indicacao").value;
    const logradouro = document.getElementById("logradouro").value;
    const numero = document.getElementById("numero").value;
    const cep = document.getElementById("cep").value;
    const bairro = document.getElementById("bairro").value;
    const cidade = document.getElementById("cidade").value;
    const estado = document.getElementById("estado").value;
    const complemento = document.getElementById("complemento").value;
  
    // Criando o payload, mas só adiciona os campos que você deseja alterar
    const payload = {
      dataNasc,
      genero,
      indicacao,
      endereco: {
        logradouro,
        cep,
        bairro,
        cidade,
        estado,
        numero,
        complemento,
      },
    };
  
    try {
      // Faz uma requisição PATCH para atualizar o usuário pelo CPF
      const usuarioResponse = await fetch(`http://localhost:8080/usuarios/atualizacao-usuario-por-cpf/${cpf}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload), // Envia apenas os campos definidos no payload
      });
  
      if (usuarioResponse.ok) {
        // Se o usuário foi atualizado com sucesso, busque os dados atualizados
        const updatedUser = await buscarDadosUsuario(); // Função para buscar o usuário novamente
  
        // Verifique se os dados estão completos agora
        if (!verificarDadosIncompletos(updatedUser)) {
          // Fechar o modal se os dados estiverem completos
          fecharModal();
  
          // Atualizar os dados no localStorage
          localStorage.setItem("nome", updatedUser.nome);
          localStorage.setItem("genero", updatedUser.genero);
          localStorage.setItem("email", updatedUser.email);
          localStorage.setItem("cpf", updatedUser.cpf);
          localStorage.setItem("instagram", updatedUser.instagram);
          localStorage.setItem("empresa", updatedUser.empresa?.idEmpresa);
          localStorage.setItem("idUsuario", updatedUser.idUsuario);
  
          showNotification("Cadastro atualizado com sucesso!", false);

          
        } else {
          showNotification("Dados incompletos. Por favor, preencha todos os campos.", true);
        }
      } else {
        const errorText = await usuarioResponse.text();
        throw new Error("Erro ao atualizar usuário: " + errorText);
      }
    } catch (error) {
      console.error("Erro geral:", error);
      showNotification(error.message, true);
    }
  });

  });

  document.addEventListener('DOMContentLoaded', function () {
    // Obter referências aos elementos do modal de ajuda
    const iconAjuda = document.getElementById('icon-ajuda');
    const modalAjuda = document.getElementById('modal-ajuda');
    const closeModalAjudaButton = document.querySelector('.modal-ajuda-close');

    // Função para mostrar o modal de ajuda
    function showModalAjuda() {
        console.log('Abrindo modal de ajuda');
        modalAjuda.style.display = 'block';
    }

    // Função para fechar o modal de ajuda
    function closeModalAjuda() {
        console.log('Fechando modal de ajuda');
        modalAjuda.style.display = 'none';
    }

    // Verifique se o ícone de ajuda está presente no DOM
    if (iconAjuda) {
        // Mostrar o modal de ajuda ao clicar no ícone de ajuda
        iconAjuda.addEventListener('click', showModalAjuda);

        // Fechar o modal de ajuda ao clicar no "X"
        closeModalAjudaButton.addEventListener('click', closeModalAjuda);

        // Fechar o modal de ajuda se o usuário clicar fora dele
        window.addEventListener('click', function (event) {
            if (event.target === modalAjuda) {
                closeModalAjuda();
            }
        });
    } else {
        console.error('Ícone de ajuda não encontrado no DOM.');
    }

    
  // Configuração da busca com lupa
  const lupaIcon = document.getElementById("lupa-icon");
  const closeIcon = document.getElementById("close-icon");
  const searchInput = document.getElementById("searchInput");

  if (lupaIcon && closeIcon && searchInput) {
    lupaIcon.addEventListener("click", function () {
      lupaIcon.style.display = "none";
      searchInput.style.display = "block";
      closeIcon.style.display = "block";
      searchInput.focus();
    });

    closeIcon.addEventListener("click", function () {
      closeIcon.style.display = "none";
      searchInput.style.display = "none";
      lupaIcon.style.display = "block";
      searchInput.value = "";
      document.getElementById("resultados").innerHTML = "";
    });
  }

  searchInput?.addEventListener("input", filtrarEspecificacoes);
  searchInput?.addEventListener("change", salvarIdsNoLocalStorage);
  carregarEspecificacoes();
});

// Função para carregar as especificações no datalist
function carregarEspecificacoes() {
  fetch("http://localhost:8080/api/especificacoes")
    .then((response) => (response.ok ? response.json() : []))
    .then((data) => {
      const dataList = document.getElementById("especificacoesList");
      dataList.innerHTML = "";

      data.sort((a, b) =>
        normalizeString(
          `${a.especificacao} - ${a.procedimento.tipo}`
        ).localeCompare(
          normalizeString(`${b.especificacao} - ${b.procedimento.tipo}`)
        )
      );

      data.forEach((item) => {
        const option = document.createElement("option");
        option.value = `${item.especificacao} - ${item.procedimento.tipo}`;
        option.dataset.normalized = normalizeString(option.value);
        option.dataset.idEspecificacao = item.idEspecificacaoProcedimento;
        option.dataset.idProcedimento = item.procedimento.idProcedimento;
        dataList.appendChild(option);
      });
    })
    .catch((error) => {
      console.error("Erro:", error);
    });
}

// Função para salvar IDs no localStorage e redirecionar
function salvarIdsNoLocalStorage() {
  const input = document.getElementById("searchInput");
  const selectedOption = Array.from(
    document.getElementById("especificacoesList").options
  ).find((option) => option.value === input.value);

  if (selectedOption) {
    localStorage.setItem(
      "idEspecificacao",
      selectedOption.dataset.idEspecificacao
    );
    localStorage.setItem(
      "idProcedimento",
      selectedOption.dataset.idProcedimento
    );
    window.location.href = "../agendamento-mobile/agendamento-mobile.html";
  }
}

// Função para filtrar opções usando busca binária
function filtrarEspecificacoes() {
  const input = document.getElementById("searchInput");
  const filter = normalizeString(input.value);
  const options = Array.from(
    document.getElementById("especificacoesList").options
  );

  options.sort((a, b) =>
    a.dataset.normalized.localeCompare(b.dataset.normalized)
  );

  const index = buscaBinaria(options, filter);

  options.forEach((option, i) => {
    option.style.display =
      i === index || option.dataset.normalized.includes(filter) ? "" : "none";
  });
}




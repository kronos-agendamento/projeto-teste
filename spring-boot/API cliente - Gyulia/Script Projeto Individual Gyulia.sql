-- drop database individual;
create database individual;
use individual;
CREATE TABLE endereco (
    id_endereco INT PRIMARY KEY AUTO_INCREMENT,
    logradouro VARCHAR(255) NOT NULL,
    cep VARCHAR(8) NOT NULL,
    numero INT NOT NULL,
    bairro VARCHAR(255),
    cidade VARCHAR(255),
    estado VARCHAR(255)
);

CREATE TABLE horario_funcionamento (
    id_horario_funcionamento INT PRIMARY KEY AUTO_INCREMENT,
    dia_semana VARCHAR(255) NOT NULL,
    horario_abertura VARCHAR(5) NOT NULL,
    horario_fechamento VARCHAR(5) NOT NULL
);

CREATE TABLE status_agendamento (
    id_status_agendamento INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(30) NOT NULL,
    cor VARCHAR(200),
    motivo VARCHAR(200)
);

CREATE TABLE nivel_acesso (
    id_nivel_acesso INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    nivel INT NOT NULL,
    descricao VARCHAR(255) NOT NULL
);

CREATE TABLE empresa (
    id_empresa INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    contato VARCHAR(11) NOT NULL,
    cnpj VARCHAR(14) NOT NULL,
    endereco_id_endereco INT NOT NULL,
    fk_horario_funcionamento INT,
    FOREIGN KEY (endereco_id_endereco) REFERENCES endereco(id_endereco),
    FOREIGN KEY (fk_horario_funcionamento) REFERENCES horario_funcionamento(id_horario_funcionamento)
);


CREATE TABLE ficha_anamnese (
    id_ficha INT PRIMARY KEY AUTO_INCREMENT,
    data_preenchimento DATETIME NOT NULL
);


CREATE TABLE pergunta (
    id_pergunta INT PRIMARY KEY AUTO_INCREMENT,
    descricao VARCHAR(70) NOT NULL,
    tipo VARCHAR(255) NOT NULL,
    status BOOLEAN DEFAULT FALSE
);

CREATE TABLE pacote (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    itens INT,
    desconto_colocacao DOUBLE NOT NULL,
    desconto_manutencao DOUBLE NOT NULL
);


CREATE TABLE procedimento (
    id_procedimento INT PRIMARY KEY AUTO_INCREMENT,
    tipo VARCHAR(100) NOT NULL,
    descricao VARCHAR(500) NOT NULL
);

CREATE TABLE usuario (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    instagram VARCHAR(50) NOT NULL,
    cpf VARCHAR(11) NOT NULL,
    telefone BIGINT NOT NULL,
    telefone_emergencial BIGINT,
    data_nasc DATE,
    genero VARCHAR(255),
    indicacao VARCHAR(255),
    foto LONGBLOB,
    status BOOLEAN,
    nivel_acesso_codigo INT,
    fk_endereco INT,
    empresa_codigo INT,
    fk_ficha_anamnese INT,
    FOREIGN KEY (nivel_acesso_codigo) REFERENCES nivel_acesso(id_nivel_acesso),
    FOREIGN KEY (fk_endereco) REFERENCES endereco(id_endereco),
    FOREIGN KEY (empresa_codigo) REFERENCES empresa(id_empresa),
    FOREIGN KEY (fk_ficha_anamnese) REFERENCES ficha_anamnese(id_ficha)
);

CREATE TABLE resposta (
    id_resposta INT PRIMARY KEY AUTO_INCREMENT,
    resposta_cliente VARCHAR(255) NOT NULL,
    fk_pergunta INT NOT NULL,
    fk_ficha INT NOT NULL,
    fk_usuario INT NOT NULL,
    FOREIGN KEY (fk_pergunta) REFERENCES pergunta(id_pergunta),
    FOREIGN KEY (fk_ficha) REFERENCES ficha_anamnese(id_ficha),
    FOREIGN KEY (fk_usuario) REFERENCES usuario(id_usuario)
);


CREATE TABLE agendamento (
    id_agendamento INT PRIMARY KEY,
    data TIMESTAMP,
    horario TIMESTAMP NOT NULL,
    tipo_agendamento INT NOT NULL,
    fk_usuario INT NOT NULL,
    fk_procedimento INT NOT NULL,
    fk_status INT NOT NULL,
    FOREIGN KEY (fk_usuario) REFERENCES usuario(id_usuario),
    FOREIGN KEY (fk_procedimento) REFERENCES procedimento(id_procedimento),
    FOREIGN KEY (fk_status) REFERENCES status_agendamento(id_status_agendamento)
);


CREATE TABLE feedback (
    id_feedback INT PRIMARY KEY AUTO_INCREMENT,
    anotacoes VARCHAR(500),
    nota INT NOT NULL,
    fk_agendamento INT NOT NULL,
    fk_usuario INT NOT NULL,
    FOREIGN KEY (fk_agendamento) REFERENCES agendamento(id_agendamento),
    FOREIGN KEY (fk_usuario) REFERENCES usuario(id_usuario)
);



CREATE TABLE complemento (
    id_complemento INT PRIMARY KEY AUTO_INCREMENT,
    complemento VARCHAR(255) NOT NULL,
    endereco_codigo INT,
    FOREIGN KEY (endereco_codigo) REFERENCES endereco(id_endereco)
);

CREATE TABLE tempo_procedimento (
    id_tempo_procedimento INT PRIMARY KEY AUTO_INCREMENT,
    tempo_colocacao VARCHAR(5) NOT NULL,
    tempo_manutencao VARCHAR(5) NOT NULL,
    tempo_retirada VARCHAR(5) NOT NULL
);


CREATE TABLE especificacao_procedimento (
    id_especificacao_procedimento INT PRIMARY KEY AUTO_INCREMENT,
    especificacao VARCHAR(70) NOT NULL,
    preco_colocacao DOUBLE NOT NULL,
    preco_manutencao DOUBLE NOT NULL,
    preco_retirada DOUBLE NOT NULL,
    foto blob,
    fk_tempo_procedimento INT NOT NULL,
    fk_procedimento INT NOT NULL,
    FOREIGN KEY (fk_tempo_procedimento) REFERENCES tempo_procedimento(id_tempo_procedimento),
    FOREIGN KEY (fk_procedimento) REFERENCES procedimento(id_procedimento)
);

CREATE TABLE item (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pacote_id INT,
    servico INT,
    quantidade INT,
    FOREIGN KEY (pacote_id) REFERENCES pacote(id)
);

select * from tempo_procedimento;
select * from procedimento;
select * from especificacao_procedimento;
select * from pacote;
select * from item;

-- select do get pacotes:
SELECT 
    p.id AS pacote_id,
    p.nome AS nome_pacote,
    p.desconto_colocacao,
    p.desconto_manutencao,
    ep.id_especificacao_procedimento,
    ep.especificacao,
    ep.preco_colocacao,
    ep.preco_manutencao,
    i.id AS item_id,
    i.servico,
    i.quantidade,
    SUM(ip.preco_colocacao * i.quantidade * (1 - p.desconto_colocacao / 100)) AS total_colocacao,
    SUM(ip.preco_manutencao * i.quantidade * (1 - p.desconto_manutencao / 100)) AS total_manutencao,
    SUM((ip.preco_colocacao * i.quantidade * (1 - p.desconto_colocacao / 100)) +
        (ip.preco_manutencao * i.quantidade * (1 - p.desconto_manutencao / 100))) AS total_geral
FROM
    pacote p
        INNER JOIN
    item i ON p.id = i.pacote_id
        INNER JOIN
    especificacao_procedimento ep ON i.pacote_id = ep.id_especificacao_procedimento
        INNER JOIN
    especificacao_procedimento ip ON ip.fk_procedimento = i.servico
WHERE
    i.id IN (1, 2, 3) -- Substitua os IDs dos itens conforme necessário
GROUP BY
    p.id, ep.id_especificacao_procedimento, i.id;

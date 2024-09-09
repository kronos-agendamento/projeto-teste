CREATE DATABASE IF NOT EXISTS kronosbooking;
USE kronosbooking;

-- Drop tables in a dependent order
DROP TABLE IF EXISTS Feedback;
DROP TABLE IF EXISTS Cliente;
DROP TABLE IF EXISTS Profissional;
DROP TABLE IF EXISTS Cilios;
DROP TABLE IF EXISTS Make;
DROP TABLE IF EXISTS Sobrancelha;
DROP TABLE IF EXISTS Agendamento;
DROP TABLE IF EXISTS Resposta;
DROP TABLE IF EXISTS Pergunta;
DROP TABLE IF EXISTS Especificacao; 
DROP TABLE IF EXISTS Procedimento; 
DROP TABLE IF EXISTS Servico;
DROP TABLE IF EXISTS Usuario;
DROP TABLE IF EXISTS FichaAnamnese;
DROP TABLE IF EXISTS Empresa;
DROP TABLE IF EXISTS HorarioFuncionamento;
DROP TABLE IF EXISTS NivelAcesso;
DROP TABLE IF EXISTS Endereco;
DROP TABLE IF EXISTS Status;
DROP TABLE IF EXISTS Leads;
-- Create tables
CREATE TABLE Endereco (
    id_endereco INT AUTO_INCREMENT PRIMARY KEY,
    logradouro VARCHAR(255) NOT NULL,
    cep VARCHAR(8) NOT NULL,
    bairro VARCHAR(255) NOT NULL,
    cidade VARCHAR(255) NOT NULL,
    estado VARCHAR(2) NOT NULL,
    numero INT NOT NULL,
    complemento VARCHAR(100)
);

CREATE TABLE NivelAcesso (
    id_nivel_acesso INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    nivel INT NOT NULL,
    descricao VARCHAR(255) NOT NULL
);

CREATE TABLE HorarioFuncionamento (
    id_horario_funcionamento INT AUTO_INCREMENT PRIMARY KEY,
    dia_inicio VARCHAR(10) NOT NULL,
    dia_fim VARCHAR(10) NOT NULL,
    horario_abertura VARCHAR(5) NOT NULL,
    horario_fechamento VARCHAR(5) NOT NULL
);

CREATE TABLE Empresa (
    id_empresa INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    telefone VARCHAR(11) NOT NULL,
    cnpj VARCHAR(18) NOT NULL,
    fk_endereco INT NOT NULL,
    fk_horario_funcionamento INT NOT NULL,
    FOREIGN KEY (fk_endereco) REFERENCES Endereco(id_endereco),
    FOREIGN KEY (fk_horario_funcionamento) REFERENCES HorarioFuncionamento(id_horario_funcionamento)
);

CREATE TABLE FichaAnamnese (
    id_ficha INT AUTO_INCREMENT PRIMARY KEY,
    data_preenchimento DATETIME NOT NULL
);

CREATE TABLE Usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    instagram VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) NOT NULL,
    telefone BIGINT NOT NULL,
    data_nasc DATE,
    genero VARCHAR(50),
    indicacao VARCHAR(255),
    foto LONGBLOB,
    status BOOLEAN DEFAULT TRUE,
    fk_nivel_acesso INT,
    fk_endereco INT,
    fk_empresa INT,
    fk_ficha_anamnese INT,
    FOREIGN KEY (fk_nivel_acesso) REFERENCES NivelAcesso(id_nivel_acesso),
    FOREIGN KEY (fk_endereco) REFERENCES Endereco(id_endereco),
    FOREIGN KEY (fk_empresa) REFERENCES Empresa(id_empresa),
    FOREIGN KEY (fk_ficha_anamnese) REFERENCES FichaAnamnese(id_ficha)
);

CREATE TABLE Servico (
    id_servico INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao VARCHAR(500) NOT NULL
);

CREATE TABLE Procedimento (
    id_procedimento INT AUTO_INCREMENT PRIMARY KEY,
    tipo VARCHAR(100) NOT NULL,
    descricao VARCHAR(500) NOT NULL
);

CREATE TABLE Especificacao (
    id_especificacao_procedimento INT AUTO_INCREMENT PRIMARY KEY,
    especificacao VARCHAR(70) NOT NULL,
    preco_colocacao DOUBLE NOT NULL,
    preco_manutencao DOUBLE NOT NULL,
    preco_retirada DOUBLE NOT NULL,
    tempo_colocacao VARCHAR(5) NOT NULL,
    tempo_manutencao VARCHAR(5) NOT NULL,
    tempo_retirada VARCHAR(5) NOT NULL,
    foto LONGBLOB,
    fk_procedimento INT NOT NULL,
    FOREIGN KEY (fk_procedimento) REFERENCES Procedimento(id_procedimento)
);

CREATE TABLE Pergunta (
    id_pergunta INT AUTO_INCREMENT PRIMARY KEY,
    pergunta VARCHAR(255) NOT NULL,
    pergunta_ativa BOOLEAN NOT NULL
);

CREATE TABLE Resposta (
    id_resposta INT AUTO_INCREMENT PRIMARY KEY,
    resposta VARCHAR(255) NOT NULL,
    fk_pergunta INT NOT NULL,
    fk_ficha_anamnese INT NOT NULL,
    fk_usuario INT NOT NULL,
    FOREIGN KEY (fk_pergunta) REFERENCES Pergunta(id_pergunta),
    FOREIGN KEY (fk_ficha_anamnese) REFERENCES FichaAnamnese(id_ficha),
    FOREIGN KEY (fk_usuario) REFERENCES Usuario(id_usuario)
);

CREATE TABLE Status (
    id_status_agendamento INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(30) NOT NULL,
    cor VARCHAR(200),
    motivo VARCHAR(200)
);

CREATE TABLE Agendamento (
    id_agendamento INT AUTO_INCREMENT PRIMARY KEY,
    data_horario DATETIME NOT NULL,
    tipo_agendamento VARCHAR(255) NOT NULL,
    fk_usuario INT NOT NULL,
    fk_procedimento INT NOT NULL,
    fk_especificacao_procedimento INT NOT NULL,
    fk_status INT NOT NULL,
    FOREIGN KEY (fk_usuario) REFERENCES Usuario(id_usuario),
    FOREIGN KEY (fk_procedimento) REFERENCES Procedimento(id_procedimento),
    FOREIGN KEY (fk_especificacao_procedimento) REFERENCES Especificacao(id_especificacao_procedimento),
    FOREIGN KEY (fk_status) REFERENCES Status(id_status_agendamento)
);

CREATE TABLE Feedback (
    id_feedback INT AUTO_INCREMENT PRIMARY KEY,
    anotacoes VARCHAR(255),
    nota INT CHECK (nota BETWEEN 1 AND 5),
    fk_agendamento INT,
    fk_usuario INT,
    fk_avaliador INT,
    fk_servico INT,
    fk_cliente_avaliado INT,
    FOREIGN KEY (fk_agendamento) REFERENCES Agendamento(id_agendamento),
    FOREIGN KEY (fk_usuario) REFERENCES Usuario(id_usuario),
    FOREIGN KEY (fk_avaliador) REFERENCES Usuario(id_usuario),
    FOREIGN KEY (fk_servico) REFERENCES Servico(id_servico),
    FOREIGN KEY (fk_cliente_avaliado) REFERENCES Usuario(id_usuario)
);

CREATE TABLE Cliente (
    id_usuario INT PRIMARY KEY,
    experiencia_avaliada VARCHAR(255),
    frequencia INT,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
);

CREATE TABLE Profissional (
    id_usuario INT PRIMARY KEY,
    numero_avaliacoes INT,
    media_nota DOUBLE,
    qualificacoes VARCHAR(255),
    especialidade VARCHAR(255),
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
);

CREATE TABLE Cilios (
    id_servico INT PRIMARY KEY,
    FOREIGN KEY (id_servico) REFERENCES Servico(id_servico)
);

CREATE TABLE Make (
    id_servico INT PRIMARY KEY,
    FOREIGN KEY (id_servico) REFERENCES Servico(id_servico)
);

CREATE TABLE Sobrancelha (
    id_servico INT PRIMARY KEY,
    FOREIGN KEY (id_servico) REFERENCES Servico(id_servico)
);

CREATE TABLE Leads (
    id_lead INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefone BIGINT NOT NULL,
    instagram VARCHAR(255),
    mensagem TEXT,
    data_criacao DATETIME
);

select * from Leads;
-- Inserts into tables
INSERT INTO Endereco (logradouro, cep, bairro, cidade, estado, numero, complemento)
VALUES ('Rua das Flores', '12345678', 'Centro', 'São Paulo', 'SP', 123, 'Apto 101'),
       ('Av. Paulista', '87654321', 'Bela Vista', 'São Paulo', 'SP', 456, 'Sala 502'),
       ('Rua dos Coqueiros', '11223344', 'Jardim', 'Campinas', 'SP', 789, NULL),
       ('Av. Brasil', '22334455', 'São João', 'Ribeirão Preto', 'SP', 101, 'Bloco B'),
       ('Rua das Acácias', '33445566', 'Boa Vista', 'São José dos Campos', 'SP', 202, 'Casa 5'),
       ('Rua das Orquídeas', '44556677', 'Vila Nova', 'São Paulo', 'SP', 303, 'Cobertura'),
       ('Rua das Margaridas', '55667788', 'Jardim Primavera', 'São Bernardo do Campo', 'SP', 404, NULL),
       ('Rua dos Manacás', '66778899', 'Centro', 'Santos', 'SP', 505, 'Apto 301'),
       ('Av. São Luís', '77889900', 'Lapa', 'São Paulo', 'SP', 606, 'Sala 303'),
       ('Rua do Cedro', '88990011', 'Santa Clara', 'Guarulhos', 'SP', 707, 'Apto 202');

INSERT INTO NivelAcesso (nome, nivel, descricao)
VALUES ('Administrador', 1, 'Acesso total'),
       ('Usuário', 2, 'Acesso limitado');

INSERT INTO HorarioFuncionamento (dia_inicio, dia_fim, horario_abertura, horario_fechamento)
VALUES ('Segunda', 'Sexta', '09:00', '18:00'),
       ('Sábado', 'Sábado', '10:00', '14:00');

INSERT INTO Empresa (nome, telefone, cnpj, fk_endereco, fk_horario_funcionamento)
VALUES ('Studio Plenitude no Olhar', '12345678901', '12345678000199', 1, 1),
       ('Beleza e Arte', '09876543210', '98765432000188', 2, 2);

INSERT INTO FichaAnamnese (data_preenchimento)
VALUES ('2024-08-01 10:00:00'),
       ('2024-08-05 14:00:00');

INSERT INTO Usuario (nome, email, senha, instagram, cpf, telefone, data_nasc, genero, indicacao, fk_nivel_acesso, fk_endereco, fk_empresa, fk_ficha_anamnese)
VALUES ('Priscila', 'priscila@example.com', 'senha123', 'priscila_ig', '123.456.789-10', 11987654321, '1990-05-15', 'Feminino', 'Amiga', 1, 1, 1, 1),
       ('João', 'joao@example.com', 'senha456', 'joao_ig', '234.567.890-11', 11912345678, '1985-08-20', 'Masculino', 'Internet', 2, 2, 2, 2);

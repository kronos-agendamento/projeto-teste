DROP DATABASE kronosbooking;
CREATE DATABASE IF NOT EXISTS kronosbooking;
USE kronosbooking;

CREATE TABLE Endereco (
    id_endereco INT AUTO_INCREMENT PRIMARY KEY,
    logradouro VARCHAR(255) NOT NULL,
    cep VARCHAR(8) NOT NULL,
    bairro VARCHAR(255) NOT NULL,
    cidade VARCHAR(255) NOT NULL,
    estado VARCHAR(255) NOT NULL,
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
    telefone_emergencial BIGINT NOT NULL,
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

CREATE TABLE TempoProcedimento (
    id_tempo_procedimento INT AUTO_INCREMENT PRIMARY KEY,
    tempo_colocacao VARCHAR(5) NOT NULL,
    tempo_manutencao VARCHAR(5) NOT NULL,
    tempo_retirada VARCHAR(5) NOT NULL
);

CREATE TABLE Especificacao (
    id_especificacao_procedimento INT AUTO_INCREMENT PRIMARY KEY,
    especificacao VARCHAR(70) NOT NULL,
    preco_colocacao DOUBLE NOT NULL,
    preco_manutencao DOUBLE NOT NULL,
    preco_retirada DOUBLE NOT NULL,
    foto LONGBLOB,
    fk_procedimento INT NOT NULL,
    fk_tempo_procedimento INT NOT NULL,
    FOREIGN KEY (fk_procedimento) REFERENCES Procedimento(id_procedimento),
    FOREIGN KEY (fk_tempo_procedimento) REFERENCES TempoProcedimento(id_tempo_procedimento)
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

-- Inserções na tabela Endereco
INSERT INTO Endereco (logradouro, cep, bairro, cidade, estado, numero, complemento)
VALUES ('Rua das Flores', '12345678', 'Centro', 'São Paulo', 'SP', 123, 'Apto 101'),
       ('Av. Paulista', '87654321', 'Bela Vista', 'São Paulo', 'SP', 456, 'Sala 502');

-- Inserções na tabela NivelAcesso
INSERT INTO NivelAcesso (nome, nivel, descricao)
VALUES ('Administrador', 1, 'Acesso total'),
       ('Usuário', 2, 'Acesso limitado');

-- Inserções na tabela HorarioFuncionamento
INSERT INTO HorarioFuncionamento (dia_inicio, dia_fim, horario_abertura, horario_fechamento)
VALUES ('Segunda', 'Sexta', '09:00', '18:00'),
       ('Sábado', 'Domingo', '10:00', '14:00');

-- Inserções na tabela Empresa
INSERT INTO Empresa (nome, telefone, cnpj, fk_endereco, fk_horario_funcionamento)
VALUES ('Estética Bella', '11987654321', '12.345.678/0001-99', 1, 1),
       ('Clínica Estética VIP', '11234567890', '98.765.432/0001-88', 2, 2);

-- Inserções na tabela FichaAnamnese
INSERT INTO FichaAnamnese (data_preenchimento)
VALUES (NOW()), (NOW());

-- Inserções na tabela Usuario
INSERT INTO Usuario (nome, email, senha, instagram, cpf, telefone, telefone_emergencial, data_nasc, genero, indicacao, foto, status, fk_nivel_acesso, fk_endereco, fk_empresa, fk_ficha_anamnese)
VALUES ('João Silva', 'joao@example.com', 'senha123', '@joaosilva', '123.456.789-00', 11987654321, 11912345678, '1985-01-01', 'Masculino', 'Amigo', NULL, TRUE, 2, 1, 1, 1),
       ('Maria Souza', 'maria@example.com', 'senha123', '@mariasouza', '987.654.321-00', 11234567890, 11987654321, '1990-02-02', 'Feminino', 'Internet', NULL, TRUE, 2, 2, 2, 2);

-- Inserções na tabela Servico
INSERT INTO Servico (nome, descricao)
VALUES ('Extensão de Cílios', 'Serviço de aplicação de extensão de cílios'),
       ('Design de Sobrancelhas', 'Serviço de design de sobrancelhas');

-- Inserções na tabela Procedimento
INSERT INTO Procedimento (tipo, descricao)
VALUES ('Cílios', 'Procedimento de aplicação de cílios'),
       ('Sobrancelhas', 'Procedimento de design de sobrancelhas');

-- Inserções na tabela TempoProcedimento
INSERT INTO TempoProcedimento (tempo_colocacao, tempo_manutencao, tempo_retirada)
VALUES ('02:00', '01:00', '00:30'),
       ('01:30', '01:00', '00:45');

-- Inserções na tabela Especificacao
INSERT INTO Especificacao (especificacao, preco_colocacao, preco_manutencao, preco_retirada, foto, fk_procedimento, fk_tempo_procedimento)
VALUES ('Cílios Volumosos', 150.00, 80.00, 50.00, NULL, 1, 1),
       ('Sobrancelhas Henna', 100.00, 60.00, 40.00, NULL, 2, 2);

-- Inserções na tabela Pergunta
INSERT INTO Pergunta (pergunta, pergunta_ativa)
VALUES ('Você tem alguma alergia?', TRUE),
       ('Você já fez algum procedimento estético antes?', TRUE);

-- Inserções na tabela Resposta
INSERT INTO Resposta (resposta, fk_pergunta, fk_ficha_anamnese, fk_usuario)
VALUES ('Não', 1, 1, 1),
       ('Sim', 2, 2, 2);

-- Inserções na tabela Status
INSERT INTO Status (nome, cor, motivo)
VALUES ('Agendado', 'Verde', 'Procedimento agendado'),
       ('Cancelado', 'Vermelho', 'Procedimento cancelado pelo cliente');

-- Inserções na tabela Agendamento
INSERT INTO Agendamento (data_horario, tipo_agendamento, fk_usuario, fk_procedimento, fk_especificacao_procedimento, fk_status)
VALUES ('2024-09-01 09:00:00', 'Colocação', 1, 1, 1, 1),
       ('2024-09-02 14:00:00', 'Manutenção', 2, 2, 2, 2);

-- Inserções na tabela Feedback
INSERT INTO Feedback (anotacoes, nota, fk_agendamento, fk_usuario, fk_avaliador, fk_servico, fk_cliente_avaliado)
VALUES ('Ótimo atendimento!', 5, 1, 1, 2, 1, 1),
       ('Satisfeita com o serviço.', 4, 2, 2, 1, 2, 2);

-- Inserções na tabela Cliente
INSERT INTO Cliente (id_usuario, experiencia_avaliada, frequencia)
VALUES (1, 'Boa', 5),
       (2, 'Excelente', 10);

-- Inserções na tabela Profissional
INSERT INTO Profissional (id_usuario, numero_avaliacoes, media_nota, qualificacoes, especialidade)
VALUES (2, 50, 4.8, 'Certificação em extensão de cílios', 'Cílios'),
       (1, 30, 4.5, 'Certificação em design de sobrancelhas', 'Sobrancelhas');

-- Inserções nas tabelas Cilios, Make, Sobrancelha
INSERT INTO Cilios (id_servico) VALUES (1);
INSERT INTO Make (id_servico) VALUES (1); -- Make não tem associação direta, mas inserido para completar
INSERT INTO Sobrancelha (id_servico) VALUES (2);

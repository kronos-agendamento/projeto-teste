CREATE DATABASE IF NOT EXISTS kronosbooking;
USE kronosbooking;

DROP TABLE IF EXISTS Feedback;
DROP TABLE IF EXISTS Cliente;
DROP TABLE IF EXISTS Profissional;
DROP TABLE IF EXISTS Agendamento;
DROP TABLE IF EXISTS Resposta;
DROP TABLE IF EXISTS Pergunta;
DROP TABLE IF EXISTS Especificacao;
DROP TABLE IF EXISTS TempoProcedimento;
DROP TABLE IF EXISTS Procedimento;
DROP TABLE IF EXISTS Usuario;
DROP TABLE IF EXISTS FichaAnamnese;
DROP TABLE IF EXISTS Empresa;
DROP TABLE IF EXISTS HorarioFuncionamento;
DROP TABLE IF EXISTS NivelAcesso;
DROP TABLE IF EXISTS Endereco;
DROP TABLE IF EXISTS Status;

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

select * from horarioFuncionamento where id_horario_funcionamento =1;

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

SELECT * FROM Empresa WHERE fk_horario_funcionamento = 1;
SELECT * FROM HorarioFuncionamento WHERE id = 1;

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
    fk_agendamento INT UNIQUE,
    fk_usuario INT,
    fk_cliente_avaliado INT,
    FOREIGN KEY (fk_agendamento) REFERENCES Agendamento(id_agendamento),
    FOREIGN KEY (fk_usuario) REFERENCES Usuario(id_usuario),
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
VALUES ('Terça', 'Sábado', '09:00', '18:00');

INSERT INTO Empresa (nome, telefone, cnpj, fk_endereco, fk_horario_funcionamento)
VALUES ('Plenitude no Olhar', '11332211099', '90.123.456/0001-88', 1, 1);

INSERT INTO FichaAnamnese (data_preenchimento)
VALUES (NOW()), 
       (NOW()), 
       (NOW()), 
       (NOW()), 
       (NOW()), 
       (NOW()), 
       (NOW()), 
       (NOW()), 
       (NOW()), 
       (NOW());

INSERT INTO Usuario (nome, email, senha, instagram, cpf, telefone, data_nasc, genero, indicacao, foto, status, fk_nivel_acesso, fk_endereco, fk_empresa, fk_ficha_anamnese)
VALUES ('Priscila Plenitude', 'pri@gmail.com', 'senha123', '@plenitude_no_olhar', '123.456.789-00', 11987654321, '1985-01-01', 'Feminino', NULL, NULL, TRUE, 1, 1, 1, 1),
       ('Maria Souza', 'maria@example.com', 'senha123', '@mariasouza', '987.654.321-00', 11234567890, '1990-02-02', 'Feminino', 'Internet', NULL, TRUE, 2, 2, NULL, 2),
       ('Pedro Santos', 'pedro@example.com', 'senha123', '@pedrosantos', '321.654.987-00', 11345678901, '1982-03-03', 'Masculino', 'Amigo', NULL, TRUE, 2, 3, NULL, 3),
       ('Ana Lima', 'ana@example.com', 'senha123', '@analima', '654.321.987-00', 11456789012, '1987-04-04', 'Feminino', 'Internet', NULL, TRUE, 2, 4, NULL, 4),
       ('Carlos Oliveira', 'carlos@example.com', 'senha123', '@carlosoliveira', '789.654.321-00', 11567890123, '1992-05-05', 'Masculino', 'Amigo', NULL, TRUE, 2, 5, NULL, 5),
       ('Juliana Costa', 'juliana@example.com', 'senha123', '@julianacosta', '890.123.456-00', 11678901234, '1995-06-06', 'Feminino', 'Internet', NULL, TRUE, 2, 6, NULL, 6),
       ('Ricardo Almeida', 'ricardo@example.com', 'senha123', '@ricardoalmeida', '901.234.567-00', 11789012345, '1999-07-07', 'Masculino', 'Amigo', NULL, TRUE, 2, 7, NULL, 7),
       ('Fernanda Martins', 'fernanda@example.com', 'senha123', '@fernandamartins', '012.345.678-00', 11890123456, '1980-08-08', 'Feminino', 'Internet', NULL, TRUE, 2, 8, NULL, 8),
       ('Marcos Pereira', 'marcos@example.com', 'senha123', '@marcospereira', '123.456.789-01', 11901234567, '1991-09-09', 'Masculino', 'Amigo', NULL, TRUE, 2, 9, NULL, 9),
       ('Camila Rocha', 'camila@example.com', 'senha123', '@camilarocha', '234.567.890-12', 12012345678, '1994-10-10', 'Feminino', 'Internet', NULL, TRUE, 2, 10, NULL, 10);

INSERT INTO Procedimento (tipo, descricao)
VALUES ('Cílios', 'Procedimento de aplicação de cílios'),
       ('Sobrancelhas', 'Procedimento de design de sobrancelhas'),
       ('Pele', 'Procedimento para tratamento de pele'),
       ('Massagem', 'Procedimento de massagem relaxante'),
       ('Facial', 'Procedimento de rejuvenescimento facial'),
       ('Esfoliação', 'Procedimento de esfoliação para pele'),
       ('Depilação', 'Procedimento de depilação com cera ou laser'),
       ('Capilar', 'Procedimento para tratamento capilar'),
       ('Maquiagem', 'Procedimento de maquiagem profissional'),
       ('Unhas', 'Procedimento de design e cuidados com as unhas');

INSERT INTO Especificacao (especificacao, preco_colocacao, preco_manutencao, preco_retirada, tempo_colocacao, tempo_manutencao, tempo_retirada, foto, fk_procedimento)
VALUES 
    ('Cílios Volumosos', 150.00, 80.00, 50.00, '01:30', '00:45', '00:30', NULL, 1),
    ('Sobrancelhas Henna', 100.00, 60.00, 40.00, '01:00', '00:30', '00:20', NULL, 2),
    ('Pele Hidratante', 120.00, 70.00, 45.00, '01:15', '00:40', '00:25', NULL, 3),
    ('Massagem Relaxante Completa', 180.00, 90.00, 60.00, '02:00', '01:00', '00:45', NULL, 4),
    ('Tratamento Facial Avançado', 250.00, 120.00, 80.00, '02:30', '01:15', '01:00', NULL, 5),
    ('Peeling Facial', 140.00, 80.00, 50.00, '01:20', '00:50', '00:30', NULL, 6),
    ('Depilação Completa', 90.00, 50.00, 30.00, '01:00', '00:40', '00:25', NULL, 7),
    ('Tratamento Capilar Intensivo', 200.00, 100.00, 70.00, '01:45', '01:00', '00:40', NULL, 8),
    ('Maquiagem para Evento', 160.00, 0.00, 0.00, '01:30', '00:00', '00:00', NULL, 9),
    ('Design de Unhas com Gel', 110.00, 0.00, 0.00, '01:15', '00:00', '00:00', NULL, 10);


INSERT INTO Pergunta (pergunta, pergunta_ativa)
VALUES ('Você tem alguma alergia?', TRUE),
       ('Você já fez algum procedimento estético antes?', TRUE),
       ('Você está grávida ou amamentando?', TRUE),
       ('Tem alguma condição médica que devemos saber?', TRUE),
       ('Você faz uso de medicamentos?', TRUE),
       ('Qual é o seu tipo de pele?', TRUE),
       ('Você tem alguma preferência em relação aos produtos utilizados?', TRUE),
       ('Você já teve reações adversas a algum produto?', TRUE),
       ('Você está fazendo algum tratamento dermatológico?', TRUE),
       ('Você já teve alguma experiência negativa com procedimentos estéticos?', TRUE);

INSERT INTO Resposta (resposta, fk_pergunta, fk_ficha_anamnese, fk_usuario)
VALUES ('Não', 1, 1, 1),
       ('Sim', 2, 2, 2),
       ('Não', 3, 3, 3),
       ('Sim', 4, 4, 4),
       ('Não', 5, 5, 5),
       ('Não', 6, 6, 6),
       ('Sim', 7, 7, 7),
       ('Não', 8, 8, 8),
       ('Sim', 9, 9, 9),
       ('Não', 10, 10, 10);

INSERT INTO Status (nome, cor, motivo)
VALUES ('Agendado', '#008000', 'Procedimento agendado'), -- Verde
       ('Cancelado', '#FF0000', 'Procedimento cancelado pelo cliente'), -- Vermelho
       ('Concluído', '#0000FF', 'Procedimento realizado com sucesso'); -- Azul

INSERT INTO Agendamento (data_horario, tipo_agendamento, fk_usuario, fk_procedimento, fk_especificacao_procedimento, fk_status)
VALUES 
    ('2024-09-01 09:00:00', 'Colocação', 10, 1, 1, 1),
    ('2024-09-02 14:00:00', 'Manutenção', 2, 2, 2, 2),
    ('2024-09-03 11:00:00', 'Limpeza', 3, 3, 3, 3),
    ('2024-09-04 16:00:00', 'Massagem', 4, 4, 4, 1),
    ('2024-09-05 10:00:00', 'Tratamento Facial', 5, 5, 5, 2),
    ('2024-09-06 15:00:00', 'Peeling', 6, 6, 6, 3),
    ('2024-09-07 09:00:00', 'Depilação', 7, 7, 7, 1),
    ('2024-09-08 14:00:00', 'Tratamento Capilar', 8, 8, 8, 2),
    ('2024-09-09 11:00:00', 'Maquiagem', 9, 9, 9, 3),
    ('2024-09-10 16:00:00', 'Design de Unhas', 10, 10, 10, 1);

SET @hoje = CURDATE();
SET @inicioSemana = @hoje - INTERVAL (DAYOFWEEK(@hoje) - 1) DAY;
SET @dias = 2; -- Terça-feira é o primeiro dia que desejamos

INSERT INTO Agendamento (data_horario, tipo_agendamento, fk_usuario, fk_procedimento, fk_especificacao_procedimento, fk_status)
VALUES 
    -- Terça-feira
    (@inicioSemana + INTERVAL @dias DAY + INTERVAL '09:00:00' HOUR_SECOND, 'Colocação', 10, 1, 1, 1),
    (@inicioSemana + INTERVAL @dias DAY + INTERVAL '11:00:00' HOUR_SECOND, 'Manutenção', 2, 2, 2, 2),
    (@inicioSemana + INTERVAL @dias DAY + INTERVAL '13:00:00' HOUR_SECOND, 'Limpeza', 3, 3, 3, 3),
    (@inicioSemana + INTERVAL @dias DAY + INTERVAL '15:00:00' HOUR_SECOND, 'Massagem', 4, 4, 4, 1),

    -- Quarta-feira
    (@inicioSemana + INTERVAL (@dias + 1) DAY + INTERVAL '10:00:00' HOUR_SECOND, 'Tratamento Facial', 5, 5, 5, 2),
    (@inicioSemana + INTERVAL (@dias + 1) DAY + INTERVAL '12:00:00' HOUR_SECOND, 'Peeling', 6, 6, 6, 3),
    (@inicioSemana + INTERVAL (@dias + 1) DAY + INTERVAL '14:00:00' HOUR_SECOND, 'Depilação', 7, 7, 7, 1),
    (@inicioSemana + INTERVAL (@dias + 1) DAY + INTERVAL '16:00:00' HOUR_SECOND, 'Tratamento Capilar', 8, 8, 8, 2),

    -- Quinta-feira
    (@inicioSemana + INTERVAL (@dias + 2) DAY + INTERVAL '09:00:00' HOUR_SECOND, 'Maquiagem', 9, 9, 9, 3),
    (@inicioSemana + INTERVAL (@dias + 2) DAY + INTERVAL '11:00:00' HOUR_SECOND, 'Design de Unhas', 10, 10, 10, 1),
    (@inicioSemana + INTERVAL (@dias + 2) DAY + INTERVAL '13:00:00' HOUR_SECOND, 'Colocação', 10, 1, 1, 1),

    -- Sexta-feira
    (@inicioSemana + INTERVAL (@dias + 3) DAY + INTERVAL '10:00:00' HOUR_SECOND, 'Manutenção', 2, 2, 2, 2),
    (@inicioSemana + INTERVAL (@dias + 3) DAY + INTERVAL '12:00:00' HOUR_SECOND, 'Limpeza', 3, 3, 3, 3),
    (@inicioSemana + INTERVAL (@dias + 3) DAY + INTERVAL '14:00:00' HOUR_SECOND, 'Massagem', 4, 4, 4, 1),
    (@inicioSemana + INTERVAL (@dias + 3) DAY + INTERVAL '16:00:00' HOUR_SECOND, 'Tratamento Facial', 5, 5, 5, 2),

    -- Sábado
    (@inicioSemana + INTERVAL (@dias + 4) DAY + INTERVAL '08:00:00' HOUR_SECOND, 'Peeling', 6, 6, 6, 3),
    (@inicioSemana + INTERVAL (@dias + 4) DAY + INTERVAL '10:00:00' HOUR_SECOND, 'Depilação', 7, 7, 7, 1),
    (@inicioSemana + INTERVAL (@dias + 4) DAY + INTERVAL '12:00:00' HOUR_SECOND, 'Tratamento Capilar', 8, 8, 8, 2),
    (@inicioSemana + INTERVAL (@dias + 4) DAY + INTERVAL '14:00:00' HOUR_SECOND, 'Maquiagem', 9, 9, 9, 3),
    (@inicioSemana + INTERVAL (@dias + 4) DAY + INTERVAL '16:00:00' HOUR_SECOND, 'Design de Unhas', 10, 10, 10, 1);

INSERT INTO Feedback (anotacoes, nota, fk_agendamento, fk_usuario, fk_cliente_avaliado)
VALUES 
    -- Feedback para agendamento (cliente avaliado é NULL)
    ('Ótimo atendimento!', 5, 1, 1, NULL),
    ('Satisfeita com o serviço.', 4, 2, 1, NULL),
    ('Muito bom, recomendo.', 5, 3, 1, NULL),
    ('Serviço excelente!', 5, 4, 1, NULL),
    ('Amei o resultado.', 5, 5, 1, NULL),
    
    -- Feedback para cliente (agendamento é NULL)
    ('Bom atendimento, mas pode melhorar.', 3, NULL, 6, 6),
    ('Não gostei, o serviço foi demorado.', 2, NULL, 7, 7),
    ('Atendimento regular, serviço razoável.', 3, NULL, 8, 8),
    ('Excelente, voltarei mais vezes.', 5, NULL, 9, 9),
    ('Muito bom, mas o preço é alto.', 4, NULL, 10, 10);


INSERT INTO Cliente (id_usuario, experiencia_avaliada, frequencia)
VALUES (1, 'Boa', 5),
       (2, 'Excelente', 10),
       (3, 'Razoável', 3),
       (4, 'Muito boa', 7),
       (5, 'Ótima', 12),
       (6, 'Regular', 2),
       (7, 'Boa', 6),
       (8, 'Excelente', 15),
       (9, 'Muito boa', 8),
       (10, 'Ótima', 10);

INSERT INTO Profissional (id_usuario, numero_avaliacoes, media_nota, qualificacoes, especialidade)
VALUES (2, 50, 4.8, 'Certificação em extensão de cílios', 'Cílios'),
       (1, 30, 4.5, 'Certificação em design de sobrancelhas', 'Sobrancelhas'),
       (3, 40, 4.7, 'Especialista em limpeza de pele', 'Pele'),
       (4, 20, 4.6, 'Massagista profissional', 'Massagem'),
       (5, 15, 4.9, 'Esteticista facial', 'Facial'),
       (6, 25, 4.4, 'Peeling especializado', 'Esfoliação'),
       (7, 35, 4.7, 'Especialista em depilação', 'Depilação'),
       (8, 28, 4.5, 'Tratamento capilar avançado', 'Capilar'),
       (9, 18, 4.8, 'Maquiadora profissional', 'Maquiagem'),
       (10, 22, 4.6, 'Especialista em design de unhas', 'Unhas');

select * from Usuario;
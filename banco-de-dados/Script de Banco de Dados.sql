drop database kronosbooking;
create database if not exists kronosbooking;
USE kronosbooking;

DROP TABLE IF EXISTS login_logoff;
DROP TABLE IF EXISTS feedback;
DROP TABLE IF EXISTS cliente;
DROP TABLE IF EXISTS profissional;
DROP TABLE IF EXISTS agendamento;
DROP TABLE IF EXISTS resposta;
DROP TABLE IF EXISTS pergunta;
DROP TABLE IF EXISTS especificacao;
DROP TABLE IF EXISTS procedimento;
DROP TABLE IF EXISTS usuario;
DROP TABLE IF EXISTS ficha_anamnese;
DROP TABLE IF EXISTS empresa;
DROP TABLE IF EXISTS horario_funcionamento;
DROP TABLE IF EXISTS nivel_acesso;
DROP TABLE IF EXISTS endereco;
DROP TABLE IF EXISTS status;
DROP PROCEDURE IF EXISTS gerar_agendamentos_aleatorios;
DROP TABLE IF EXISTS Leads;

CREATE TABLE endereco (
    id_endereco INT AUTO_INCREMENT PRIMARY KEY,
    logradouro VARCHAR(255) NOT NULL,
    cep VARCHAR(8) NOT NULL,
    bairro VARCHAR(255) NOT NULL,
    cidade VARCHAR(255) NOT NULL,
    estado VARCHAR(255) NOT NULL,
    numero VARCHAR(255) NOT NULL,
    complemento VARCHAR(100)
);

CREATE TABLE nivel_acesso (
    id_nivel_acesso INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    nivel INT NOT NULL,
    descricao VARCHAR(255) NOT NULL
);

CREATE TABLE horario_funcionamento (
    id_horario_funcionamento INT AUTO_INCREMENT PRIMARY KEY,
    dia_inicio VARCHAR(10) NOT NULL,
    dia_fim VARCHAR(10) NOT NULL,
    horario_abertura VARCHAR(5) NOT NULL,
    horario_fechamento VARCHAR(5) NOT NULL
);

CREATE TABLE empresa (
    id_empresa INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    telefone VARCHAR(11) NOT NULL,
    cnpj VARCHAR(18) NOT NULL,
    fk_endereco INT NOT NULL,
    fk_horario_funcionamento INT NOT NULL,
    FOREIGN KEY (fk_endereco) REFERENCES endereco(id_endereco),
    FOREIGN KEY (fk_horario_funcionamento) REFERENCES horario_funcionamento(id_horario_funcionamento)
);

CREATE TABLE ficha_anamnese (
    id_ficha INT AUTO_INCREMENT PRIMARY KEY,
    data_preenchimento DATETIME NOT NULL
);

CREATE TABLE usuario (
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
    avaliacao int,
    status BOOLEAN DEFAULT TRUE,
	dtype VARCHAR(31),  -- Adiciona o campo dtype para o discriminador
    fk_nivel_acesso INT,
    fk_endereco INT,
    fk_empresa INT,
    fk_ficha_anamnese INT,
    FOREIGN KEY (fk_nivel_acesso) REFERENCES nivel_acesso(id_nivel_acesso),
    FOREIGN KEY (fk_endereco) REFERENCES endereco(id_endereco),
    FOREIGN KEY (fk_empresa) REFERENCES empresa(id_empresa),
    FOREIGN KEY (fk_ficha_anamnese) REFERENCES ficha_anamnese(id_ficha)
);

create table login_logoff (
id_log INT auto_increment PRIMARY KEY,
logi VARCHAR(5) NOT NULL,
data_horario DATETIME NOT NULL,
fk_usuario INT NOT NULL,
FOREIGN KEY (fk_usuario) references usuario(id_usuario)
);

CREATE TABLE procedimento (
    id_procedimento INT AUTO_INCREMENT PRIMARY KEY,
    tipo VARCHAR(100) NOT NULL,
    descricao VARCHAR(500) NOT NULL
);

CREATE TABLE especificacao (
    id_especificacao_procedimento INT AUTO_INCREMENT PRIMARY KEY,
    especificacao VARCHAR(70) NOT NULL,
    preco_colocacao DOUBLE NOT NULL,
    preco_manutencao DOUBLE NOT NULL,
    preco_retirada DOUBLE NOT NULL,
    tempo_colocacao VARCHAR(5) NOT NULL,
    tempo_manutencao VARCHAR(5) NOT NULL,
    tempo_retirada VARCHAR(5) NOT NULL,
    colocacao BOOLEAN NOT NULL,
    manutencao BOOLEAN NOT NULL,
    retirada BOOLEAN NOT NULL,
    homecare BOOLEAN NOT NULL,
    foto LONGBLOB,
    fk_procedimento INT NOT NULL,
    FOREIGN KEY (fk_procedimento) REFERENCES procedimento(id_procedimento)
);

CREATE TABLE pergunta (
    id_pergunta INT AUTO_INCREMENT PRIMARY KEY,
    pergunta VARCHAR(255) NOT NULL,
    pergunta_ativa BOOLEAN NOT NULL,
    pergunta_tipo VARCHAR(255) NOT NULL
);

CREATE TABLE resposta (
    id_resposta INT AUTO_INCREMENT PRIMARY KEY,
    resposta VARCHAR(255) NOT NULL,
    fk_pergunta INT NOT NULL,
    fk_ficha_anamnese INT NOT NULL,
    fk_usuario INT NOT NULL,
    FOREIGN KEY (fk_pergunta) REFERENCES pergunta(id_pergunta),
    FOREIGN KEY (fk_ficha_anamnese) REFERENCES ficha_anamnese(id_ficha),
    FOREIGN KEY (fk_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

CREATE TABLE status (
    id_status_agendamento INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(30) NOT NULL,
    cor VARCHAR(200),
    motivo VARCHAR(200)
);

CREATE TABLE agendamento (
    id_agendamento INT AUTO_INCREMENT PRIMARY KEY,
    data_horario DATETIME NOT NULL,
    tipo_agendamento VARCHAR(255) NOT NULL,
    tempo_para_agendar INT,
    homecare BOOLEAN,
    valor DOUBLE,
    fk_usuario INT NOT NULL,
    fk_procedimento INT,
    fk_especificacao_procedimento INT,
    fk_status INT NOT NULL,
    FOREIGN KEY (fk_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (fk_procedimento) REFERENCES procedimento(id_procedimento),
    FOREIGN KEY (fk_especificacao_procedimento) REFERENCES especificacao(id_especificacao_procedimento),
    FOREIGN KEY (fk_status) REFERENCES status(id_status_agendamento)
);

CREATE TABLE feedback (
    id_feedback INT AUTO_INCREMENT PRIMARY KEY,
    anotacoes VARCHAR(255),
    nota INT CHECK (nota BETWEEN 1 AND 5),
    fk_agendamento INT UNIQUE,
    fk_usuario INT,
    fk_cliente_avaliado INT,
    FOREIGN KEY (fk_agendamento) REFERENCES agendamento(id_agendamento) ON DELETE CASCADE,
    FOREIGN KEY (fk_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (fk_cliente_avaliado) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

CREATE TABLE cliente (
    id_usuario INT PRIMARY KEY,
    experiencia_avaliada VARCHAR(255),
    frequencia INT,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

CREATE TABLE profissional (
		id_usuario INT PRIMARY KEY,
		numero_avaliacoes INT,
		media_nota DOUBLE,
		qualificacoes VARCHAR(255),
		especialidade VARCHAR(255),
		FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
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

INSERT INTO endereco (logradouro, cep, bairro, cidade, estado, numero, complemento)
VALUES 
('Rua das Flores', '12345678', 'Vila Prudente', 'São Paulo', 'SP', '100', 'Apto 101'),
('Avenida Brasil', '87654321', 'Centro', 'Rio de Janeiro', 'RJ', '200', 'Bloco B'),
('Rua do Sol', '13579246', 'Bela Vista', 'Belo Horizonte', 'MG', '300', 'Sala 10'),
('Avenida Paulista', '98765432', 'Paulista', 'São Paulo', 'SP', '400', NULL),
('Rua das Orquídeas', '19283746', 'Moema', 'São Paulo', 'SP', '500', 'Casa'),
('Rua Jardim das Acácias', '10293847', 'Jardim Europa', 'São Paulo', 'SP', '600', 'Cobertura'),
('Rua dos Girassóis', '56473829', 'Tatuapé', 'São Paulo', 'SP', '700', 'Apto 702'),
('Rua das Magnólias', '90817263', 'Morumbi', 'São Paulo', 'SP', '800', NULL),
('Avenida Sapopemba', '28374659', 'Sapopemba', 'São Paulo', 'SP', '900', 'Sala 905'),
('Rua dos Lírios', '38492047', 'Centro', 'Guarulhos', 'SP', '1000', 'Apto 1001'),
('Rua Haddock Lobo', '01414001', 'Consolação', 'São Paulo', 'SP', '595', 'Faculdade');

INSERT INTO nivel_acesso (nome, nivel, descricao)
VALUES 
('Administrador', 1, 'Acesso total ao sistema'),
('Profissional', 2, 'Acesso para gerenciar procedimentos e agendamentos');

INSERT INTO horario_funcionamento (dia_inicio, dia_fim, horario_abertura, horario_fechamento)
VALUES 
('Segunda', 'Sexta', '09:00', '18:00'),
('Sábado', 'Sábado', '10:00', '14:00'),
('Segunda', 'Sexta', '08:00', '17:00'),
('Segunda', 'Quinta', '09:30', '19:30'),
('Terça', 'Sábado', '08:30', '17:30'),
('Segunda', 'Sábado', '08:00', '20:00'),
('Quarta', 'Domingo', '10:00', '16:00'),
('Terça', 'Sexta', '09:00', '18:00'),
('Quarta', 'Sábado', '08:00', '18:00'),
('Segunda', 'Quinta', '09:00', '17:00'),
('Segunda', 'Sexta', '16:30', '21:30');

INSERT INTO empresa (nome, telefone, cnpj, fk_endereco, fk_horario_funcionamento)
VALUES 
('Plenitude no Olhar', '11987654321', '04.669.985/0001-01', 1, 1),
('Beleza Suprema', '21987654322', '38.056.805/0001-20', 2, 2),
('Olhar Perfeito', '31987654323', '10.735.721/0001-01', 3, 3),
('Glamour Sobrancelhas', '41987654324', '39.555.755/0001-98', 4, 4),
('Cílios de Diva', '51987654325', '07.159.343/0001-42', 5, 5),
('Makeup Studio', '61987654326', '88.838.187/0001-48', 6, 6),
('Estética Refinada', '71987654327', '20.461.436/0001-95', 7, 7),
('Sobrancelhas de Ouro', '81987654328', '93.959.301/0001-28', 8, 8),
('Cílios e Sobrancelhas', '91987654329', '18.053.709/0001-10', 9, 9),
('Sobrancelhas Elegantes', '11987654330', '64.824.719/0001-20', 10, 10),
('Kronos', '11987654330', '58.918.570/0001-45', 11, 11);

INSERT INTO ficha_anamnese (data_preenchimento)
VALUES 
(NOW()), 
(NOW()), 
(NOW()), 
(NOW()), 
(NOW()), 
(NOW()), 
(NOW()), 
(NOW()), 
(NOW()), 
(NOW()),
(NOW());

INSERT INTO usuario (nome, email, senha, instagram, cpf, telefone, data_nasc, genero, indicacao, status, fk_nivel_acesso, fk_endereco, fk_empresa, fk_ficha_anamnese)
VALUES 
('Priscila Plenitude', 'priscila@plenitude.com', 'senhaAdmin', '@plenitudenoolhar', '401.235.740-99', 11987654321, '1980-01-01', 'Feminino', 'Instagram', TRUE, 1, 1, 1, NULL),
('Ana Paula', 'ana@beleza.com', 'senha123', '@anabeauty', '363.813.610-85', 21987654321, '1992-02-02', 'Feminino', 'Indicação de Amiga', TRUE, 2, 2, 2, 2),
('Carlos Eduardo', 'carlos@olharperfeito.com', 'senha123', '@carlosedu', '166.801.900-02', 31987654322, '1995-03-03', 'Masculino', 'Facebook', TRUE, 2, 3, 3, 3),
('Juliana Costa', 'juliana@glamour.com', 'senha123', '@jucosta', '058.534.810-37', 41987654323, '1990-04-04', 'Feminino', 'Google', TRUE, 2, 4, 4, 4),
('Roberta Silva', 'roberta@ciliosdiva.com', 'senha123', '@robdiva', '735.394.060-34', 51987654324, '1993-05-05', 'Feminino', 'Instagram', TRUE, 2, 5, 5, 5),
('Daniel Souza', 'daniel@makeup.com', 'senha123', '@danmake', '756.507.960-09', 61987654325, '1991-06-06', 'Masculino', 'Indicação de Influencer', TRUE, 2, 6, 6, 6),
('Larissa Nunes', 'larissa@refinada.com', 'senha123', '@larissarefinada', '418.774.800-88', 71987654326, '1987-07-07', 'Feminino', 'Instagram', TRUE, 2, 7, 7, 7),
('Tatiana Melo', 'tatiana@ouro.com', 'senha123', '@tatiouro', '491.260.810-67', 81987654327, '1985-08-08', 'Feminino', 'Indicação de Amiga', TRUE, 2, 8, 8, 8),
('Paula Gomes', 'paula@cilios.com', 'senha123', '@paulagomes', '701.221.130-04', 91987654328, '1982-09-09', 'Feminino', 'Indicação Familiar', TRUE, 2, 9, 9, 9),
('Marília Costa', 'cecilia@elegantes.com', 'senha123', '@ceciliaelegantes', '701.221.130-04', 11987654329, '1989-10-19', 'Feminino', 'Instagram', TRUE, 2, 10, 10, 10);

INSERT INTO procedimento (tipo, descricao)
VALUES 
('Maquiagem', 'Diversos tipos de maquiagem para eventos'),
('Sobrancelha', 'Modelagem e tratamento de sobrancelhas'),
('Cílios', 'Alongamento e volume de cílios');

INSERT INTO especificacao (especificacao, preco_colocacao, preco_manutencao, preco_retirada, tempo_colocacao, tempo_manutencao, tempo_retirada, colocacao, manutencao, retirada, homecare, fk_procedimento)
VALUES 
('Extensão de Cílios Fio a Fio', 150.00, 100.00, 50.00, '02:00', '01:30', '01:00', true, true, true, false, 3),
('Extensão de Cílios Volume Russo', 200.00, 120.00, 70.00, '02:30', '01:40', '01:10', true, true, true, false, 3),
('Design de Sobrancelhas', 80.00, 50.00, 30.00, '00:40', '00:30', '00:20', true, true, true, false, 2),
('Micropigmentação de Sobrancelhas', 250.00, 150.00, 80.00, '03:00', '02:00', '01:30', true, true, true, false, 2),
('Henna para Sobrancelhas', 70.00, 40.00, 20.00, '01:00', '00:45', '00:30', true, true, true, false, 2),
('Maquiagem Social', 100.00, 0.00, 0.00, '01:30', '00:00', '00:00', true, false, false, true, 1),
('Maquiagem para Noivas', 300.00, 0.00, 0.00, '03:00', '00:00', '00:00', true, false, false, true, 1),
('Lifting de Cílios', 120.00, 80.00, 40.00, '01:30', '01:00', '00:45', true, true, true, false, 3),
('Maquiagem Artística', 200.00, 0.00, 0.00, '02:00', '00:00', '00:00', true, false, false, true, 1),
('Maquiagem para Eventos', 150.00, 0.00, 0.00, '02:00', '00:00', '00:00', true, false, false, true, 1);

INSERT INTO pergunta (pergunta, pergunta_ativa, pergunta_tipo)
VALUES 
('Você tem alergia a algum produto?', TRUE, 'Input'),
('Já teve reações adversas em algum procedimento anterior?', TRUE, 'Input'),
('Você faz uso de medicamentos?', TRUE, 'Select'),
('Você está grávida ou amamentando?', TRUE, 'Select'),
('Você tem problemas de pele?', TRUE, 'Select'),
('Você já fez micropigmentação antes?', TRUE, 'Select'),
('Você usa produtos específicos nos cílios ou sobrancelhas?', TRUE, 'Input'),
('Você já fez algum procedimento estético nos últimos 6 meses?', TRUE, 'Select'),
('Tem alguma doença crônica que deveríamos saber?', TRUE, 'Input'),
('Está utilizando algum tratamento dermatológico?', TRUE, 'Select');

-- Inserção de respostas para o usuário 2 (Ana Paula)
INSERT INTO resposta (resposta, fk_pergunta, fk_ficha_anamnese, fk_usuario)
VALUES 
('Não', 1, 2, 2),
('Não, nunca tive problemas com procedimentos.', 2, 2, 2),
('Sim, tomo anti-inflamatórios regularmente.', 3, 2, 2),
('Não, não estou grávida nem amamentando.', 4, 2, 2),
('Não, minha pele está saudável.', 5, 2, 2),
('Não, nunca fiz micropigmentação.', 6, 2, 2),
('Sim, uso óleo de rícino nos cílios.', 7, 2, 2),
('Não, não fiz nenhum procedimento estético nos últimos meses.', 8, 2, 2),
('Não, não tenho nenhuma doença crônica.', 9, 2, 2),
('Sim, estou em tratamento com ácido retinoico.', 10, 2, 2);

-- Inserção de respostas para o usuário 3 (Carlos Eduardo)
INSERT INTO resposta (resposta, fk_pergunta, fk_ficha_anamnese, fk_usuario)
VALUES 
('Sim, sou alérgico a látex.', 1, 3, 3),
('Sim, já tive uma reação leve ao fazer extensão de cílios.', 2, 3, 3),
('Sim, uso medicamento para hipertensão.', 3, 3, 3),
('Não, minha parceira está grávida, mas eu não.', 4, 3, 3),
('Sim, tenho psoríase leve.', 5, 3, 3),
('Não, nunca fiz micropigmentação.', 6, 3, 3),
('Sim, uso máscara específica para cílios diariamente.', 7, 3, 3),
('Sim, fiz um tratamento estético no rosto há 3 meses.', 8, 3, 3),
('Não, não tenho nenhuma doença crônica.', 9, 3, 3),
('Não, não estou em nenhum tratamento dermatológico.', 10, 3, 3);

-- Inserção de respostas para o usuário 4 (Juliana Costa)
INSERT INTO resposta (resposta, fk_pergunta, fk_ficha_anamnese, fk_usuario)
VALUES 
('Não, não tenho alergia a nenhum produto.', 1, 4, 4),
('Sim, já tive vermelhidão após um peeling químico.', 2, 4, 4),
('Sim, estou tomando antibiótico para infecção.', 3, 4, 4),
('Não, não estou grávida nem amamentando.', 4, 4, 4),
('Sim, tenho acne ocasional.', 5, 4, 4),
('Sim, fiz micropigmentação de sobrancelha há 2 anos.', 6, 4, 4),
('Sim, uso soro fisiológico nos cílios.', 7, 4, 4),
('Sim, fiz um tratamento de laser no rosto há 4 meses.', 8, 4, 4),
('Sim, tenho hipotireoidismo.', 9, 4, 4),
('Não, não estou em tratamento dermatológico no momento.', 10, 4, 4);

INSERT INTO status (nome, cor, motivo)
VALUES 
('Agendado', '#00FF00', 'Cliente agendado com sucesso'),
('Cancelado', '#FF0000', 'Cliente cancelou o agendamento'),
('Concluído', '#0000FF', 'Procedimento realizado com sucesso'),
('Não Compareceu', '#FF9900', 'Cliente não compareceu ao agendamento'),
('Em Espera', '#FFFF00', 'Aguardando confirmação do cliente'),
('Remarcado', '#FF00FF', 'Agendamento remarcado pelo cliente'),
('Confirmado', '#00FFFF', 'Cliente confirmou o agendamento'),
('Em Andamento', '#009900', 'Procedimento está sendo realizado'),
('Atrasado', '#CC3300', 'Cliente está atrasado para o procedimento'),
('Finalizado', '#3366CC', 'Atendimento finalizado com sucesso');

-- Inserindo agendamentos para garantir que os usuários fidelizados apareçam
INSERT INTO agendamento (id_agendamento, data_horario, tipo_agendamento, tempo_para_agendar, fk_usuario, fk_procedimento, fk_especificacao_procedimento, fk_status) VALUES
-- Agendamentos para Maria Silva (id_usuario = 7)
(1, '2024-07-15 09:00:00', 'Manutencao', 30, 7, 1, 2, 1),
(2, '2024-08-12 11:00:00', 'Colocacao', 40, 7, 1, 3, 1),
(3, '2024-09-10 14:00:00', 'Retirada', 35, 7, 1, 1, 1),

-- Agendamentos para Carla Borges (id_usuario = 8)
(4, '2024-07-10 10:00:00', 'Manutencao', 20, 8, 2, 3, 1),
(5, '2024-08-08 12:00:00', 'Colocacao', 30, 8, 2, 2, 1),
(6, '2024-09-05 13:00:00', 'Retirada', 25, 8, 2, 1, 1),

-- Agendamentos para Pedro Marques (id_usuario = 9)
(7, '2024-07-20 09:30:00', 'Colocacao', 45, 9, 3, 1, 1),
(8, '2024-08-18 10:00:00', 'Manutencao', 50, 9, 3, 2, 1),
(9, '2024-09-15 11:00:00', 'Retirada', 30, 9, 3, 1, 1),

-- Agendamentos para Ana Martins (id_usuario = 10)
(10, '2024-07-05 09:00:00', 'Colocacao', 25, 10, 1, 3, 1),
(11, '2024-08-02 10:30:00', 'Manutencao', 40, 10, 1, 2, 1),
(12, '2024-09-12 12:00:00', 'Retirada', 35, 10, 1, 1, 1);

INSERT INTO cliente (id_usuario, experiencia_avaliada, frequencia)
VALUES 
(2, 'Positiva', 5),
(3, 'Positiva', 4),
(4, 'Negativa', 1),
(5, 'Positiva', 6),
(6, 'Positiva', 3),
(7, 'Negativa', 1),
(8, 'Positiva', 2),
(9, 'Positiva', 4),
(10, 'Positiva', 5);

INSERT INTO profissional (id_usuario, numero_avaliacoes, media_nota, qualificacoes, especialidade)
VALUES 
(2, 10, 4.9, 'Especialista em Extensão de Cílios', 'Cílios'),
(3, 12, 4.8, 'Especialista em Design de Sobrancelhas', 'Sobrancelhas'),
(4, 9, 4.7, 'Micropigmentadora', 'Sobrancelhas'),
(5, 15, 5.0, 'Especialista em Maquiagem para Noivas', 'Maquiagem'),
(6, 8, 4.6, 'Maquiadora Artística', 'Maquiagem'),
(7, 7, 4.5, 'Especialista em Lifting de Cílios', 'Cílios'),
(8, 6, 4.4, 'Técnica em Henna para Sobrancelhas', 'Sobrancelhas'),
(9, 11, 4.8, 'Designer de Sobrancelhas', 'Sobrancelhas'),
(10, 5, 4.3, 'Maquiadora Social', 'Maquiagem');

INSERT INTO Leads (nome, email, telefone, instagram, mensagem, data_criacao)
VALUES 
('Maria Silva', 'maria.silva@example.com', 11987654321, '@mariasilva', 'Gostaria de saber mais sobre seus serviços.', NOW()),
('João Pereira', 'joao.pereira@example.com', 11912345678, '@joaopereira', 'Tenho interesse em fazer uma extensão de cílios.', NOW()),
('Ana Souza', 'ana.souza@example.com', 11987611234, NULL, 'Quais são os valores para design de sobrancelha?', NOW()),
('Carla Oliveira', 'carla.oliveira@example.com', 11933332222, '@carlaoliveira', 'Vi uma promoção no Instagram e quero mais detalhes.', NOW()),
('Pedro Santos', 'pedro.santos@example.com', 11998765432, '@pedrosantos', 'Como funciona o procedimento de volume russo?', NOW());

UPDATE usuario 
SET dtype = 'Cliente' 
WHERE fk_nivel_acesso = 2;

UPDATE usuario 
SET dtype = 'Profissional' 
WHERE fk_nivel_acesso = 1;

-- Tabela agendamento
ALTER TABLE agendamento 
ADD CONSTRAINT fk_usuario_agendamento 
FOREIGN KEY (fk_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE;

-- Tabela feedback
ALTER TABLE feedback 
ADD CONSTRAINT fk_usuario_feedback 
FOREIGN KEY (fk_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE;

-- Tabela cliente
ALTER TABLE cliente 
ADD CONSTRAINT fk_usuario_cliente 
FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE;

-- Tabela profissional
ALTER TABLE profissional 
ADD CONSTRAINT fk_usuario_profissional 
FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE;

-- Tabela login_logoff
ALTER TABLE login_logoff 
ADD CONSTRAINT fk_usuario_login_logoff 
FOREIGN KEY (fk_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE;

ALTER TABLE usuario 
ADD CONSTRAINT fk_ficha_anamnese_usuario 
FOREIGN KEY (fk_ficha_anamnese) REFERENCES ficha_anamnese(id_ficha) ON DELETE CASCADE;

ALTER TABLE resposta 
DROP FOREIGN KEY resposta_ibfk_1;

ALTER TABLE resposta
ADD CONSTRAINT fk_resposta_pergunta
FOREIGN KEY (fk_pergunta) REFERENCES pergunta(id_pergunta) ON DELETE CASCADE;

INSERT INTO login_logoff (logi, data_horario, fk_usuario) VALUES
('LOGIN', '2023-01-01 09:00:00', 1),
('LOGOF', '2023-01-01 10:00:00', 1),
('LOGIN', '2023-02-15 09:00:00', 1),
('LOGOF', '2023-02-15 10:00:00', 1),
('LOGIN', '2023-04-01 09:00:00', 1),
('LOGOF', '2023-04-01 10:00:00', 1),

('LOGIN', '2023-01-05 11:00:00', 2),
('LOGOF', '2023-01-05 12:00:00', 2),
('LOGIN', '2023-01-25 09:00:00', 2),
('LOGOF', '2023-01-25 10:00:00', 2),
('LOGIN', '2023-02-05 09:00:00', 2),
('LOGOF', '2023-02-05 10:00:00', 2),

('LOGIN', '2023-02-10 08:00:00', 3),
('LOGOF', '2023-02-10 09:00:00', 3),
('LOGIN', '2023-03-15 08:00:00', 3),
('LOGOF', '2023-03-15 09:00:00', 3),
('LOGIN', '2023-05-20 08:00:00', 3),
('LOGOF', '2023-05-20 09:00:00', 3),

('LOGIN', '2023-02-15 13:00:00', 4),
('LOGOF', '2023-02-15 14:00:00', 4),

('LOGIN', '2023-01-01 08:00:00', 5),
('LOGOF', '2023-01-01 09:00:00', 5),
('LOGIN', '2023-03-05 08:00:00', 5),
('LOGOF', '2023-03-05 09:00:00', 5),
('LOGIN', '2023-06-15 08:00:00', 5),
('LOGOF', '2023-06-15 09:00:00', 5),

('LOGIN', '2023-03-10 09:30:00', 6),
('LOGOF', '2023-03-10 10:00:00', 6),
('LOGIN', '2023-04-15 09:30:00', 6),
('LOGOF', '2023-04-15 10:30:00', 6),
('LOGIN', '2023-05-25 09:30:00', 6),
('LOGOF', '2023-05-25 10:30:00', 6),

('LOGIN', '2023-05-01 08:00:00', 7),
('LOGOF', '2023-05-01 09:00:00', 7),
('LOGIN', '2023-05-20 08:00:00', 7),
('LOGOF', '2023-05-20 09:00:00', 7),
('LOGIN', '2023-06-01 08:00:00', 7),
('LOGOF', '2023-06-01 09:00:00', 7),

('LOGIN', '2023-04-10 09:00:00', 8),
('LOGOF', '2023-04-10 10:00:00', 8),

('LOGIN', '2023-01-01 09:00:00', 9),
('LOGOF', '2023-01-01 10:00:00', 9),
('LOGIN', '2023-02-01 09:00:00', 9),
('LOGOF', '2023-02-01 10:00:00', 9),

('LOGIN', '2023-01-01 07:00:00', 10),
('LOGOF', '2023-01-01 08:00:00', 10),
('LOGIN', '2023-01-20 07:00:00', 10),
('LOGOF', '2023-01-20 08:00:00', 10),
('LOGIN', '2023-03-05 07:00:00', 10),
('LOGOF', '2023-03-05 08:00:00', 10);

DELIMITER //

CREATE PROCEDURE gerar_agendamentos_aleatorios()
BEGIN
  DECLARE dia_atual DATE;
  DECLARE fim DATE;
  DECLARE qtd_agendamentos INT;

  DECLARE hora_aleatoria TIME;
  DECLARE mes_atual INT;
  DECLARE usuario_fidelizado INT;
  DECLARE tempo_aleatorio INT;
  DECLARE preco_base DOUBLE;

  SET @usuarios_fidelizados = '1,4,6';  -- IDs dos usuários a serem fidelizados

  IF WEEKDAY(CURDATE()) = 0 THEN 
    SET dia_atual = DATE_ADD(CURDATE(), INTERVAL 1 DAY);  -- Segunda-feira desta semana
  ELSE 
    SET dia_atual = DATE_ADD(CURDATE(), INTERVAL (8 - WEEKDAY(CURDATE())) DAY);  -- Segunda-feira da próxima semana
  END IF;

  SET fim = DATE_ADD(dia_atual, INTERVAL 5 DAY);

  SET @min_agendamentos = 2;
  SET @max_agendamentos = 6;

  SET mes_atual = 0;

  WHILE mes_atual < 5 DO  -- Alterado de 3 para 5 para incluir os últimos 5 meses
    SET dia_atual = DATE_ADD(CURDATE(), INTERVAL - mes_atual MONTH);
    SET fim = DATE_ADD(dia_atual, INTERVAL 5 DAY);

    WHILE dia_atual <= fim DO
      SET qtd_agendamentos = @min_agendamentos + FLOOR(RAND() * (@max_agendamentos - @min_agendamentos + 1));

      WHILE qtd_agendamentos > 0 DO
        SET hora_aleatoria = SEC_TO_TIME(FLOOR(RAND() * (10 * 3600)) + 8 * 3600);
        SET tempo_aleatorio = 15 + FLOOR(RAND() * 106);
        SET usuario_fidelizado = CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(@usuarios_fidelizados, ',', FLOOR(1 + (RAND() * 4))), ',', -1) AS UNSIGNED);

        -- Determinar o preço base da especificação
        SET preco_base = 100 + FLOOR(RAND() * 201); -- Preço aleatório entre R$100 e R$300

        INSERT INTO agendamento (data_horario, tipo_agendamento, fk_usuario, fk_procedimento, fk_especificacao_procedimento, fk_status, tempo_para_agendar, homecare, valor)
        SELECT 
          CONCAT(dia_atual, ' ', hora_aleatoria) AS data_horario, 
          CASE FLOOR(RAND() * 2) 
            WHEN 0 THEN 'Colocação'
            ELSE 'Manutenção'
          END AS tipo_agendamento, 
          usuario_fidelizado AS fk_usuario, 
          FLOOR(1 + (RAND() * 3)) AS fk_procedimento, 
          FLOOR(1 + (RAND() * 10)) AS fk_especificacao_procedimento, 
          FLOOR(1 + (RAND() * 10)) AS fk_status,  -- Gera um status aleatório entre 1 e 10
          tempo_aleatorio AS tempo_para_agendar,
          CASE FLOOR(RAND() * 2) 
            WHEN 0 THEN TRUE
            ELSE FALSE
          END AS homecare,  -- Valor booleano aleatório
          preco_base -- Define o valor aleatório calculado
        FROM (SELECT 1) AS dummy;

        SET qtd_agendamentos = qtd_agendamentos - 1;
      END WHILE;

      SET dia_atual = DATE_ADD(dia_atual, INTERVAL 1 DAY);

    END WHILE;

    SET mes_atual = mes_atual + 1;
  END WHILE;

END //

DELIMITER ;

CALL gerar_agendamentos_aleatorios();

INSERT INTO feedback (anotacoes, nota, fk_agendamento, fk_usuario, fk_cliente_avaliado)
VALUES 
('Ótimo atendimento, super recomendo!', 5, 1, 2, 3),
('Satisfeita com o resultado!', 4, 2, 3, 4),
('Procedimento excelente, volto sempre!', 5, 4, 5, 6),
('Gostei do atendimento, mas acho que poderia melhorar a pontualidade.', 3, 5, 6, 7),
('Muito bom, fiquei satisfeita com o serviço!', 5, 6, 7, 8),
('Atendimento ótimo, o profissional foi muito atencioso.', 5, 8, 9, 10),
('Sobrancelha perfeita! Adorei o resultado.', 5, 9, 10, 2),
('Ótimo trabalho, mas o tempo de espera foi um pouco longo.', 4, 3, 4, 6),
('Profissional muito educado e atencioso.', 5, 7, 8, 3),
('Adorei o resultado final! Super recomendo.', 5, 10, 2, 5);

SELECT * FROM usuario;

SELECT * FROM agendamento;	
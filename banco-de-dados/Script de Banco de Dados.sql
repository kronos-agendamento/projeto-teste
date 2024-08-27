-- Criação do banco de dados
CREATE DATABASE IF NOT EXISTS kronosbooking;
USE kronosbooking;

-- Dropando tabelas se existirem
DROP TABLE IF EXISTS feedback;
DROP TABLE IF EXISTS agendamento;
DROP TABLE IF EXISTS especificacao_procedimento;
DROP TABLE IF EXISTS tempo_procedimento;
DROP TABLE IF EXISTS procedimento;
DROP TABLE IF EXISTS status_agendamento;
DROP TABLE IF EXISTS resposta;
DROP TABLE IF EXISTS pergunta;
DROP TABLE IF EXISTS usuario;
DROP TABLE IF EXISTS ficha_anamnese;
DROP TABLE IF EXISTS nivel_acesso;
DROP TABLE IF EXISTS empresa;
DROP TABLE IF EXISTS horario_funcionamento;
DROP TABLE IF EXISTS complemento;
DROP TABLE IF EXISTS endereco;
DROP TABLE IF EXISTS capacitacao;

-- Criação das tabelas
CREATE TABLE endereco (
    id_endereco INT PRIMARY KEY AUTO_INCREMENT,
    logradouro VARCHAR(50),
    cep VARCHAR(8),
    numero INT,
    bairro VARCHAR(50),
    cidade VARCHAR(60),
    estado VARCHAR(2)
);

CREATE TABLE complemento (
    id_complemento INT PRIMARY KEY AUTO_INCREMENT,
    complemento VARCHAR(70),
    fk_endereco INT,
    FOREIGN KEY (fk_endereco) REFERENCES endereco(id_endereco)
);

	CREATE TABLE horario_funcionamento (
		id_horario_funcionamento INT PRIMARY KEY AUTO_INCREMENT,
		dia_inicio VARCHAR(45),
		dia_fim VARCHAR(45),
		horario_abertura VARCHAR(5),
		horario_fechamento VARCHAR(5)
	);

CREATE TABLE empresa (
    id_empresa INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(70),
    contato CHAR(11),
    cnpj VARCHAR(14),
    endereco_id_endereco INT,
    fk_horario_funcionamento INT,
    FOREIGN KEY (endereco_id_endereco) REFERENCES endereco(id_endereco),
    FOREIGN KEY (fk_horario_funcionamento) REFERENCES horario_funcionamento(id_horario_funcionamento)
);

CREATE TABLE nivel_acesso (
    id_nivel_acesso INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(30),
    nivel INT,
    descricao VARCHAR(255)
);

CREATE TABLE ficha_anamnese (
    id_ficha INT PRIMARY KEY AUTO_INCREMENT,
    data_preenchimento DATETIME
);

CREATE TABLE usuario (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100),
    email VARCHAR(100),
    senha VARCHAR(50),
    instagram VARCHAR(50),
    cpf VARCHAR(11),
    telefone BIGINT,
    telefone_emergencial BIGINT,
    data_nasc DATE,
    genero VARCHAR(100),
    indicacao VARCHAR(100),
    foto BLOB,
    status BOOLEAN,
    fk_nivel_acesso INT,
    fk_endereco INT,
    fk_empresa INT,
    fk_ficha_anamnese INT,
    FOREIGN KEY (fk_nivel_acesso) REFERENCES nivel_acesso(id_nivel_acesso),
    FOREIGN KEY (fk_endereco) REFERENCES endereco(id_endereco),
    FOREIGN KEY (fk_empresa) REFERENCES empresa(id_empresa),
    FOREIGN KEY (fk_ficha_anamnese) REFERENCES ficha_anamnese(id_ficha)
);

CREATE TABLE pergunta (
    id_pergunta INT PRIMARY KEY AUTO_INCREMENT,
    descricao VARCHAR(255),
    tipo VARCHAR(45),
    status BOOLEAN
);

CREATE TABLE resposta (
    id_resposta INT PRIMARY KEY AUTO_INCREMENT,
    fk_pergunta INT,
    fk_ficha INT,
    fk_usuario INT,
    resposta_cliente VARCHAR(45),
    FOREIGN KEY (fk_pergunta) REFERENCES pergunta(id_pergunta),
    FOREIGN KEY (fk_ficha) REFERENCES ficha_anamnese(id_ficha),
    FOREIGN KEY (fk_usuario) REFERENCES usuario(id_usuario)
);

CREATE TABLE status_agendamento (
    id_status_agendamento INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(30),
    cor VARCHAR(10),
    motivo VARCHAR(45)
);

CREATE TABLE procedimento (
    id_procedimento INT PRIMARY KEY AUTO_INCREMENT,
    tipo VARCHAR(50),
    descricao VARCHAR(255)
);

CREATE TABLE tempo_procedimento (
    id_tempo_procedimento INT PRIMARY KEY AUTO_INCREMENT,
    tempo_colocacao VARCHAR(5),
    tempo_manutencao VARCHAR(5),
    tempo_retirada VARCHAR(5)
);

CREATE TABLE especificacao_procedimento (
    id_especificacao_procedimento INT PRIMARY KEY AUTO_INCREMENT,
    especificacao VARCHAR(70),
    preco_colocacao DOUBLE,
    preco_manutencao DOUBLE,
    preco_retirada DOUBLE,
    foto BLOB,
    fk_tempo_procedimento INT,
    fk_procedimento INT,
    FOREIGN KEY (fk_tempo_procedimento) REFERENCES tempo_procedimento(id_tempo_procedimento),
    FOREIGN KEY (fk_procedimento) REFERENCES procedimento(id_procedimento)
);

CREATE TABLE agendamento (
    id_agendamento INT PRIMARY KEY AUTO_INCREMENT,
    data_horario DATETIME,
    tipo_agendamento VARCHAR(45),
    fk_usuario INT,
    fk_procedimento INT,
    fk_status INT,
    fk_especificacao_procedimento INT,
    FOREIGN KEY (fk_usuario) REFERENCES usuario(id_usuario),
    FOREIGN KEY (fk_procedimento) REFERENCES procedimento(id_procedimento),
    FOREIGN KEY (fk_status) REFERENCES status_agendamento(id_status_agendamento),
    FOREIGN KEY (fk_especificacao_procedimento) REFERENCES especificacao_procedimento(id_especificacao_procedimento)
);

CREATE TABLE feedback (
    id_feedback INT PRIMARY KEY AUTO_INCREMENT,
    anotacoes VARCHAR(200),
    nota INT CHECK(nota BETWEEN 1 AND 5),
    fk_agendamento INT,
    fk_usuario INT,
    fk_avaliador INT,
    fk_servico INT,
    FOREIGN KEY (fk_agendamento) REFERENCES agendamento(id_agendamento),
    FOREIGN KEY (fk_usuario) REFERENCES usuario(id_usuario),
    FOREIGN KEY (fk_avaliador) REFERENCES avaliador(id_avaliador),
    FOREIGN KEY (fk_servico) REFERENCES servico(id_servico)
);

CREATE TABLE capacitacao (
    id_capacitacao INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(70),
    descricao VARCHAR(100),
    nivel VARCHAR(50),
    modalidade VARCHAR(50),
    carga_horaria VARCHAR(30),
    preco_capacitacao DOUBLE,
	ativo boolean default true
);

CREATE TABLE servico (
    id_servico INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100),
    descricao TEXT
);

-- Tabela avaliador
CREATE TABLE avaliador (
    id_avaliador INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100),
    email VARCHAR(100),
    instagram VARCHAR(50)
);

-- Tabela cilios
CREATE TABLE cilios (
    id_servico INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100),
    descricao TEXT,
    FOREIGN KEY (id_servico) REFERENCES servico(id_servico)
);

-- Tabela sobrancelha
CREATE TABLE sobrancelha (
    id_servico INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100),
    descricao TEXT,
    FOREIGN KEY (id_servico) REFERENCES servico(id_servico)
);

-- Tabela make
CREATE TABLE make (
    id_servico INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100),
    descricao TEXT,
    FOREIGN KEY (id_servico) REFERENCES servico(id_servico)
);

-- Inserir endereços
INSERT INTO endereco (logradouro, cep, numero, bairro, cidade, estado)
VALUES 
('Rua das Flores', '12345678', 100, 'Centro', 'São Paulo', 'SP'),
('Avenida Paulista', '87654321', 1500, 'Bela Vista', 'São Paulo', 'SP'),
('Rua das Palmeiras', '11223344', 500, 'Jardins', 'São Paulo', 'SP');

-- Inserir complementos
INSERT INTO complemento (complemento, fk_endereco)
VALUES 
('Apto 101', 1),
('Sala 202', 2),
('Casa 1', 3);

INSERT INTO horario_funcionamento (dia_inicio, dia_fim, horario_abertura, horario_fechamento)
VALUES 
('Segunda-feira', 'Segunda-feira', '09:00', '18:00'),
('Terça-feira', 'Terça-feira', '09:00', '18:00'),
('Quarta-feira', 'Quarta-feira', '09:00', '18:00'),
('Quinta-feira', 'Quinta-feira', '09:00', '18:00'),
('Sexta-feira', 'Sexta-feira', '09:00', '18:00');

-- Inserir empresas com os IDs corretos de horários de funcionamento
INSERT INTO empresa (nome, contato, cnpj, endereco_id_endereco, fk_horario_funcionamento)
VALUES 
('Clínica Estética SP', '11999999999', '12345678000101', 1, 1),
('Beleza Paulista', '11888888888', '87654321000199', 2, 2);

-- Inserir níveis de acesso
INSERT INTO nivel_acesso (nome, nivel, descricao)
VALUES 
('Administrador', 1, 'Acesso total ao sistema'),
('Recepcionista', 2, 'Acesso limitado a agendamentos e clientes'),
('Esteticista', 3, 'Acesso aos procedimentos e clientes');

-- Inserir fichas de anamnese
INSERT INTO ficha_anamnese (data_preenchimento)
VALUES 
(NOW());

-- Inserir usuários
INSERT INTO usuario (nome, email, senha, instagram, cpf, telefone, telefone_emergencial, data_nasc, genero, indicacao, foto, status, fk_nivel_acesso, fk_endereco, fk_empresa, fk_ficha_anamnese)
VALUES 
('Maria Silva', 'maria@gmail.com', 'senha123', '@maria', '12345678901', '11999999999', '11988888888', '1990-01-01', 'Feminino', 'Amiga', NULL, TRUE, 1, 1, 1, 1),
('João Pereira', 'joao@gmail.com', 'senha123', '@joao', '10987654321', '11977777777', '11966666666', '1985-05-15', 'Masculino', 'Internet', NULL, TRUE, 2, 2, 1, 1),
('Ana Souza', 'ana@gmail.com', 'senha123', '@ana', '12345098765', '11955555555', '11944444444', '1992-07-21', 'Feminino', 'Cliente', NULL, TRUE, 3, 3, 2, 1);

-- Inserir perguntas
INSERT INTO pergunta (descricao, tipo, status)
VALUES 
('Tem alergia a algum produto?', 'Sim/Não', TRUE),
('Já fez algum procedimento estético antes?', 'Sim/Não', TRUE);

-- Inserir respostas
INSERT INTO resposta (fk_pergunta, fk_ficha, fk_usuario, resposta_cliente)
VALUES 
(1, 1, 1, 'Não'),
(2, 1, 1, 'Sim'),
(1, 1, 2, 'Sim'),
(2, 1, 2, 'Não');

-- Inserir status de agendamento
INSERT INTO status_agendamento (nome, cor, motivo)
VALUES 
('Agendado', '#008000', 'Confirmado pelo cliente'),  -- Verde
('Cancelado', '#FF0000', 'Cliente cancelou'),        -- Vermelho
('Concluído', '#0000FF', 'Procedimento realizado');  -- Azul


-- Inserir procedimentos
INSERT INTO procedimento (tipo, descricao)
VALUES 
('Sobrancelha', 'Design e micropigmentação de sobrancelhas'),
('Maquiagem', 'Maquiagem para diversas ocasiões'),
('Cílios', 'Aplicação e manutenção de cílios');

-- Inserir tempo de procedimento
INSERT INTO tempo_procedimento (tempo_colocacao, tempo_manutencao, tempo_retirada)
VALUES 
('01:00', '00:30', '00:30'),
('01:30', '01:00', '00:45'),
('02:00', '01:30', '01:00');

-- Inserir especificações de procedimento
INSERT INTO especificacao_procedimento (especificacao, preco_colocacao, preco_manutencao, preco_retirada, foto, fk_tempo_procedimento, fk_procedimento)
VALUES 
('Design de Sobrancelha', 100.00, 50.00, 30.00, NULL, 1, 1),
('Micropigmentação de Sobrancelha', 300.00, 150.00, 100.00, NULL, 2, 1),
('Maquiagem Social', 200.00, 100.00, 70.00, NULL, 3, 2),
('Maquiagem para Noivas', 500.00, 250.00, 150.00, NULL, 2, 2),
('Aplicação de Cílios', 150.00, 75.00, 50.00, NULL, 1, 3),
('Manutenção de Cílios', 100.00, 50.00, 30.00, NULL, 1, 3);

-- Inserir agendamentos com datas e horários variados
INSERT INTO agendamento (data_horario, tipo_agendamento, fk_usuario, fk_procedimento, fk_status, fk_especificacao_procedimento)
VALUES
-- 2024-08-01
('2024-08-01 09:00:00', 'Manutenção', 1, 1, 1, 1),
('2024-08-02 10:00:00', 'Primeira vez', 1, 2, 1, 2),
('2024-07-23 11:00:00', 'Retorno', 2, 3, 1, 3),
('2024-07-22 12:00:00', 'Manutenção', 3, 1, 1, 4),
('2024-08-05 13:00:00', 'Primeira vez', 2, 2, 2, 5),
('2024-07-17 14:00:00', 'Retorno', 3, 3, 3, 6);

-- Inserir feedbacks
INSERT INTO feedback (anotacoes, nota, fk_agendamento, fk_usuario)
VALUES 
('Ótimo atendimento!', 5, 1, 1),
('Muito satisfeita com o serviço.', 5, 2, 2),
('Excelente profissional.', 5, 3, 3);

-- Inserir capacitações
INSERT INTO capacitacao (nome, descricao, nivel, modalidade, carga_horaria, preco_capacitacao, ativo)
VALUES 
('Design de Sobrancelhas', 'Curso completo de design de sobrancelhas', 'Básico', 'Presencial', '20 horas', 500.00, TRUE),
('Maquiagem Profissional', 'Curso de maquiagem profissional', 'Intermediário', 'Online', '30 horas', 700.00, TRUE),
('Extensão de Cílios', 'Curso de extensão de cílios', 'Avançado', 'Presencial', '25 horas', 800.00, TRUE);

select * from usuario;
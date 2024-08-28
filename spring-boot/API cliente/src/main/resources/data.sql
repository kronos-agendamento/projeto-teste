-- Inserções aleatórias na tabela endereco
INSERT INTO endereco (logradouro, cep, numero, bairro, cidade, estado)
VALUES ('Rua das Flores', '12345678', 101, 'Centro', 'São Paulo', 'SP'),
       ('Avenida Brasil', '87654321', 202, 'Jardim América', 'Rio de Janeiro', 'RJ'),
       ('Rua Minas Gerais', '13579246', 303, 'Savassi', 'Belo Horizonte', 'MG');

-- Inserções aleatórias na tabela complemento
INSERT INTO complemento (complemento, fk_endereco)
VALUES ('Apto 1', 1),
       ('Sala 101', 2),
       ('Cobertura', 3);

-- Inserções aleatórias na tabela horario_funcionamento
INSERT INTO horario_funcionamento (dia_semana, horario_abertura, horario_fechamento)
VALUES ('Segunda', '09:00', '18:00'),
       ('Terça', '09:00', '18:00'),
       ('Quarta', '09:00', '18:00'),
       ('Quinta', '09:00', '18:00'),
       ('Sexta', '09:00', '18:00'),
       ('Sábado', '10:00', '14:00');

-- Inserções aleatórias na tabela empresa
INSERT INTO empresa (nome, contato, cnpj, endereco_id_endereco, fk_horario_funcionamento)
VALUES ('Beleza Estética', '11111111111', '12345678901234', 1, 1),
       ('Clínica de Estética RJ', '22222222222', '98765432109876', 2, 2),
       ('Estética BH', '33333333333', '45678901234567', 3, 3);

-- Inserções aleatórias na tabela nivel_acesso
INSERT INTO nivel_acesso (nome, nivel, descricao)
VALUES ('Admin', 1, 'Acesso total ao sistema'),
       ('Funcionário', 2, 'Acesso limitado a agendamentos e clientes'),
       ('Cliente', 3, 'Acesso a agendamentos próprios');

-- Inserções aleatórias na tabela ficha_anamnese
INSERT INTO ficha_anamnese (data_preenchimento)
VALUES ('2024-06-01'),
       ('2024-06-02'),
       ('2024-06-03');

-- Inserções aleatórias na tabela usuario
INSERT INTO usuario (nome, email, senha, instagram, cpf, telefone, telefone_emergencial, data_nasc, genero, indicacao,
                     foto, status, fk_nivel_acesso, fk_endereco, fk_empresa, fk_ficha_anamnese)
VALUES ('Maria Silva', 'maria@example.com', 'senha123', '@mariasilva', '12345678901', '11999999999', '11988888888',
        '1985-01-15', 'Feminino', 'Instagram', NULL, true, 3, 1, 1, 1),
       ('João Souza', 'joao@example.com', 'senha456', '@joaosouza', '98765432109', '21999999999', '21988888888',
        '1990-05-20', 'Masculino', 'Indicação de amigo', NULL, true, 3, 2, 2, 2),
       ('Ana Costa', 'ana@example.com', 'senha789', '@anacosta', '45678901234', '31999999999', '31988888888',
        '1992-10-30', 'Feminino', 'Facebook', NULL, true, 3, 3, 3, 3);

-- Inserções aleatórias na tabela pergunta
INSERT INTO pergunta (descricao, tipo, status)
VALUES ('Possui alergia a algum produto?', 'Texto', true),
       ('Já realizou procedimentos estéticos anteriormente?', 'Texto', true),
       ('Qual sua expectativa com o procedimento?', 'Texto', true);

-- Inserções aleatórias na tabela resposta
INSERT INTO resposta (fk_pergunta, fk_ficha, fk_usuario, resposta_cliente)
VALUES (1, 1, 1, 'Não'),
       (2, 2, 2, 'Sim, já fiz micropigmentação de sobrancelha.'),
       (3, 3, 3, 'Quero melhorar a aparência dos cílios.');

-- Inserções aleatórias na tabela status_agendamento
INSERT INTO status_agendamento (nome, cor, motivo)
VALUES ('Confirmado', 'Verde', 'Agendamento confirmado pelo cliente'),
       ('Pendente', 'Amarelo', 'Aguardando confirmação'),
       ('Cancelado', 'Vermelho', 'Cancelado pelo cliente');

-- Inserções aleatórias na tabela procedimento
INSERT INTO procedimento (tipo, descricao)
VALUES ('Extensão de Cílios', 'Aplicação de extensão de cílios fio a fio.'),
       ('Design de Sobrancelhas', 'Modelagem e design de sobrancelhas.'),
       ('Maquiagem', 'Maquiagem para eventos especiais.');

-- Inserções aleatórias na tabela tempo_procedimento
INSERT INTO tempo_procedimento (tempo_colocacao, tempo_manutencao, tempo_retirada)
VALUES ('01:30', '01:00', '00:30'),
       ('00:45', '00:30', '00:20'),
       ('01:00', '00:45', '00:30');

-- Inserções aleatórias na tabela especificacao_procedimento
INSERT INTO especificacao_procedimento (especificacao, preco_colocacao, preco_manutencao, preco_retirada,
                                        fk_tempo_procedimento, fk_procedimento)
VALUES ('Cílios fio a fio', 150.00, 80.00, 50.00, 1, 1),
       ('Design simples', 50.00, 30.00, 20.00, 2, 2),
       ('Maquiagem completa', 200.00, 120.00, 80.00, 3, 3);

-- Inserções aleatórias na tabela agendamento
INSERT INTO agendamento (data, horario, tipo_agendamento, fk_usuario, fk_procedimento, fk_status)
VALUES ('2024-06-01', '2024-06-01 09:00:00', '1', 1, 1, 1),
       ('2024-05-02', '2024-05-02 10:00:00', '2', 2, 2, 2),
       ('2024-04-03', '2024-04-03 11:00:00', '1', 3, 3, 3),
       ('2024-03-18 10:00:00', '2024-03-18 10:00:00', 1, 1, 1, 1),
       ('2024-02-19 11:00:00', '2024-02-19 11:00:00', 2, 2, 2, 2),
       ('2024-01-20 09:30:00', '2024-01-20 09:30:00', 3, 3, 3, 3);

-- Inserções aleatórias na tabela feedback
INSERT INTO feedback (anotacoes, nota, fk_agendamento, fk_usuario)
VALUES ('Serviço excelente, muito atenciosa.', 5, 1, 1),
       ('Gostei do resultado, mas o atendimento poderia ser mais rápido.', 4, 2, 2),
       ('Amei o resultado, vou voltar com certeza!', 5, 3, 3);

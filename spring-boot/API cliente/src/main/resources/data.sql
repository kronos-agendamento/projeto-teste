-- Inserções aleatórias na tabela endereco
INSERT INTO endereco (logradouro, cep, numero, bairro, cidade, estado)
VALUES ('Rua A', '12345678', 123, 'Bairro X', 'Cidade A', 'SP'),
       ('Rua B', '87654321', 456, 'Bairro Y', 'Cidade B', 'RJ'),
       ('Rua C', '13579246', 789, 'Bairro Z', 'Cidade C', 'MG');

-- Inserções aleatórias na tabela complemento
INSERT INTO complemento (complemento, fk_endereco)
VALUES ('Complemento 1', 1),
       ('Complemento 2', 2),
       ('Complemento 3', 3);

-- Inserções aleatórias na tabela horario_funcionamento
INSERT INTO horario_funcionamento (dia_semana, horario_abertura, horario_fechamento)
VALUES ('Segunda', '08:00', '18:00'),
       ('Terça', '09:00', '19:00'),
       ('Quarta', '07:30', '17:30');

-- Inserções aleatórias na tabela empresa
INSERT INTO empresa (nome, contato, cnpj, endereco_id_endereco, fk_horario_funcionamento)
VALUES ('Empresa A', '11111111111', '12345678901234', 1, 1),
       ('Empresa B', '22222222222', '98765432109876', 2, 2),
       ('Empresa C', '33333333333', '45678901234567', 3, 3);

-- Inserções aleatórias na tabela nivel_acesso
INSERT INTO nivel_acesso (nome, nivel, descricao)
VALUES ('Nível 1', 1, 'Descrição do nível 1'),
       ('Nível 2', 2, 'Descrição do nível 2'),
       ('Nível 3', 3, 'Descrição do nível 3');

-- Inserções aleatórias na tabela ficha_anamnese
INSERT INTO ficha_anamnese (data_preenchimento)
VALUES ('2024-06-01'),
       ('2024-06-02'),
       ('2024-06-03');

-- Inserções aleatórias na tabela usuario
INSERT INTO usuario (nome, email, senha, instagram, cpf, telefone, telefone_emergencial, data_nasc, genero, indicacao,
                     foto, status, fk_nivel_acesso, fk_endereco, fk_empresa, fk_ficha_anamnese)
VALUES ('Usuario 1', 'usuario1@example.com', 'senha1', 'instagram1', '12345678901', 1111111111, 2222222222,
        '1990-01-01', 'Masculino', 'Indicação 1', NULL, true, 1, 1, 1, 1),
       ('Usuario 2', 'usuario2@example.com', 'senha2', 'instagram2', '98765432109', 3333333333, 4444444444,
        '1995-05-05', 'Feminino', 'Indicação 2', NULL, true, 2, 2, 2, 2),
       ('Usuario 3', 'usuario3@example.com', 'senha3', 'instagram3', '45678901234', 5555555555, 6666666666,
        '2000-10-10', 'Outro', 'Indicação 3', NULL, true, 3, 3, 3, 3);

-- Inserções aleatórias na tabela pergunta
INSERT INTO pergunta (descricao, tipo, status)
VALUES ('Pergunta 1', 'Tipo 1', true),
       ('Pergunta 2', 'Tipo 2', true),
       ('Pergunta 3', 'Tipo 3', true);

-- Inserções aleatórias na tabela resposta
INSERT INTO resposta (fk_pergunta, fk_ficha, fk_usuario, resposta_cliente)
VALUES (1, 1, 1, 'Resposta 1'),
       (2, 2, 2, 'Resposta 2'),
       (3, 3, 3, 'Resposta 3');

-- Inserções aleatórias na tabela status_agendamento
INSERT INTO status_agendamento (nome, cor, motivo)
VALUES ('Status 1', 'Azul', 'Motivo 1'),
       ('Status 2', 'Vermelho', 'Motivo 2'),
       ('Status 3', 'Verde', 'Motivo 3');

-- Inserções aleatórias na tabela procedimento
INSERT INTO procedimento (tipo, descricao)
VALUES ('Procedimento 1', 'Descrição do procedimento 1'),
       ('Procedimento 2', 'Descrição do procedimento 2'),
       ('Procedimento 3', 'Descrição do procedimento 3');

-- Inserções aleatórias na tabela tempo_procedimento
INSERT INTO tempo_procedimento (tempo_colocacao, tempo_manutencao, tempo_retirada)
VALUES ('01:00', '00:30', '00:20'),
       ('02:00', '01:00', '00:40'),
       ('03:00', '01:30', '00:50');

-- Inserções aleatórias na tabela especificacao_procedimento
INSERT INTO especificacao_procedimento (especificacao, preco_colocacao, preco_manutencao, preco_retirada,
                                        fk_tempo_procedimento, fk_procedimento)
VALUES ('Especificacao 1', 100.00, 50.00, 30.00, 1, 1),
       ('Especificacao 2', 200.00, 100.00, 60.00, 2, 2),
       ('Especificacao 3', 300.00, 150.00, 90.00, 3, 3);

-- Inserções aleatórias na tabela agendamento
INSERT INTO agendamento (data, horario, tipo_agendamento, fk_usuario, fk_procedimento, fk_status)
VALUES ('2024-06-01', '2024-06-01 08:00:00', 1, 1, 1, 1),
       ('2024-06-02', '2024-06-02 09:00:00', 2, 2, 2, 2),
       ('2024-06-03', '2024-06-03 10:00:00', 3, 3, 3, 3);

-- Inserções aleatórias na tabela feedback
INSERT INTO feedback (anotacoes, nota, fk_agendamento, fk_usuario)
VALUES ('Anotacoes 1', 4, 1, 1),
       ('Anotacoes 2', 3, 2, 2),
       ('Anotacoes 3', 5, 3, 3);

-- Inserções aleatórias na tabela publicacao
INSERT INTO publicacao (titulo, legenda, foto, curtidas, id_usuario)
VALUES ('Título 1', 'Legenda 1', 'foto1.jpg', 10, 1),
       ('Título 2', 'Legenda 2', 'foto2.jpg', 15, 2),
       ('Título 3', 'Legenda 3', 'foto3.jpg', 20, 3);

-- Inserções aleatórias na tabela comentario
INSERT INTO comentario (texto, curtidas, id_publicacao, id_usuario)
VALUES ('Texto 1', 2, 1, 1),
       ('Texto 2', 3, 2, 2),
       ('Texto 3', 4, 3, 3);
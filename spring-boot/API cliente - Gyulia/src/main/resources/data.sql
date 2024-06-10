-- Aqui podemos ter uma ou mais intruções DML (insert, update e delete)
-- ao final é obrigatório ter um ; se não, dará erro

-- sistema
insert into pergunta(descricao, tipo, status)
values ('você está gravida?', 'gravidez', true),
       ('você tem alergia a cosméticos?', 'cosmeticos', false);

insert into nivel_acesso(nome, nivel, descricao)
values ('adm', 1, 'acesso ilimitado'),
       ('cliente', 2, 'apenas paginas principais');

       -- Inserção de dados na tabela endereco e horario_funcionamento
       INSERT INTO endereco (numero, cep, bairro, cidade, estado, logradouro) VALUES (123, '12345678', 'Centro', 'São Paulo', 'SP', 'Rua Exemplo');
       INSERT INTO horario_funcionamento (dia_semana, horario_abertura, horario_fechamento) VALUES ('Segunda-feira', '08:00', '18:00');

       -- Inserção de dados na tabela empresa
       INSERT INTO empresa (nome, cnpj, contato, fk_horario_funcionamento, endereco_id_endereco)
       VALUES ('Plenitude No Olhar', '44073219000196', '11976656788', 1, 1);


--insert into horario_funcionamento(dia_semana, horario_abertura, horario_fechamento)
--values ('terça a sabado', '9:00', '19:00');
--
--insert into endereco (logradouro, CEP, numero)
--values ('rua piauna', 04258030, 149),
--       ('rua das orquideas', 04259530, 753),
--       ('av das americas', 02658030, 159);
--
--insert into empresa(nome, cnpj, contato, horario_funcionamento_codigo, endereco_codigo)
--values ('Plenitude No Olhar', '44073219000196', '11976656788', 1, 1);

-- usuario
insert into usuario (nome, email, senha, instagram, cpf, telefone, telefone_emergencial, data_nasc, genero, indicacao,
                     status, nivel_acesso_codigo, empresa_codigo)
values ('Priscila', 'Priscila@gmail.com', 'Pri@123', '@Pri', '48372073830', 999569966, 449569966, '1998-05-05', 'FEM',
        'Não', true, 1, 1),
       ('Ana', 'Ana@gmail.com', 'Ana@123', '@Aninha', '47142690816', 999999966, 999869966, '2004-05-05', 'FEM', 'Não',
        true, 2, 1),
       ('Fernanda', 'Fernanda@gmail.com', '@Fernanda.123', '@Fefe', '47148768816', 999999967, 299569966, '2009-02-05',
        'FEM', 'Sim, Aninha', false, 2, 1);


insert into complemento (complemento, endereco_codigo)
values ('casa 3', 1),
       ('apto 10', 1);



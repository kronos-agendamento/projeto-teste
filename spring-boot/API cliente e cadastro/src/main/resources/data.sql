-- Aqui podemos ter uma ou mais intruções DML (insert, update e delete)
-- ao final é obrigatório ter um ; se não, dará erro

insert into resposta(tipo, formatacao) values
('sim ou não', 'boolean');

insert into pergunta(tipo, nome, resposta_codigo_resposta) values
('sobrancelha', 'você está gravida?', 1),
('sobrancelha', 'você já fez micropigmentação', 1);

insert into pergunta_ficha(status, nome, pergunta_codigo_pergunta, resposta_codigo_resposta) values
('true', 'gravidez', 1, 1);

insert into cliente (nome, email, senha, instagram, celular, cpf, data_nascimento, genero, indicacao, nivel_acesso, status) values
('Ana', 'Ana@gmail.com', 'Ana@123', '@Aninha', '999999966', '47148790816', '2004-05-05', 'FEM', 'Não', 1, true ),
('Priscila', 'Priscila@gmail.com', 'Pri@123', '@Pri', '999569966', '48372073830', '1998-05-05', 'FEM', 'Não', 2, false );




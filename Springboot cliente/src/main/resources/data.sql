-- Aqui podemos ter uma ou mais intruções DML (insert, update e delete)
-- ao final é obrigatório ter um ; se não, dará erro
insert into musica (nome, total_ouvintes, lancamento, classico, estilo) values
('musica 1', 11111, '2006-05-20', true, 'asdfg'),
('musica 2', 22, '2004-02-02', false, 'dfghjytrd'),
('musica 3', 333, '2015-05-05', true, 'dfghjytrd'),
('musica 4', 4444, '2005-03-03', false, 'gtrdx');


insert into cliente (nome, email, senha, instagram, celular, cpf, data_nascimento, genero, indicacao, nivel_acesso, status) values
('Ana', 'Ana@gmail.com', 'Ana@123', '@Aninha', '999999966', '47148790816', '2004-05-05', 'FEM', 'Não', 1, true ),
('Priscila', 'Priscila@gmail.com', 'Pri@123', '@Pri', '999569966', '48372073830', '1998-05-05', 'FEM', 'Não', 2, false );



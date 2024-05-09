-- Aqui podemos ter 1 ou mais instruções DML (insert, update e delete)
-- ao final de cada um É OBRIGATÓRIO um ponto e vírgula (;)
insert into compositor (nome) values
('poeta 1'),
('artista 1'),
('artista 2');

insert into musica (nome, total_ouvintes, lancamento, compositor_codigo) values
('musica 1', 1, '2018-01-01', 1),
('musica 2', 22, '2024-01-01', 2),
('melodia 3', 333, '2020-01-01', 2),
('melodia 4', 4444, '2021-01-01', 3);
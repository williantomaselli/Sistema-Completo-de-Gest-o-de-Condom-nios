-- 1) Criação do banco de dados
CREATE DATABASE IF NOT EXISTS condominio;
USE condominio;

-- 2) Tabela de Blocos
CREATE TABLE bloco (
  id INT AUTO_INCREMENT PRIMARY KEY,
  descricao VARCHAR(100) NOT NULL,
  qtde_apartamentos INT NOT NULL,
  UNIQUE KEY uq_bloco_descricao (descricao)
);

-- 3) Tabela de Apartamentos
CREATE TABLE apartamento (
  id INT AUTO_INCREMENT PRIMARY KEY,
  numero VARCHAR(10) NOT NULL,
  bloco_id INT NOT NULL,
  andar INT NOT NULL,
  FOREIGN KEY (bloco_id) REFERENCES bloco(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  UNIQUE KEY uq_apartamento (numero, bloco_id)
);

-- 4) Tabela de Moradores
CREATE TABLE morador (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  cpf VARCHAR(14) NOT NULL,
  telefone VARCHAR(20),
  apartamento_id INT NOT NULL,
  FOREIGN KEY (apartamento_id) REFERENCES apartamento(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  UNIQUE KEY uq_morador_cpf (cpf)
);

-- 5) Tabela de Referências de Pagamento (mês/ano)
CREATE TABLE referencia (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mes TINYINT NOT NULL CHECK (mes BETWEEN 1 AND 12),
  ano SMALLINT NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  vencimento DATE NOT NULL,
  UNIQUE KEY uq_referencia (mes, ano)
);

-- 6) Tabela de Pagamentos
CREATE TABLE pagamento (
  id INT AUTO_INCREMENT PRIMARY KEY,
  morador_id INT NOT NULL,
  referencia_id INT NOT NULL,
  data_pagamento DATE NOT NULL,
  valor_pago DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (morador_id) REFERENCES morador(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  FOREIGN KEY (referencia_id) REFERENCES referencia(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  UNIQUE KEY uq_pagamento (morador_id, referencia_id)
);

-- 7) Tabela de Tipos de Manutenção
CREATE TABLE tipo_manutencao (
  id INT AUTO_INCREMENT PRIMARY KEY,
  descricao VARCHAR(100) NOT NULL,
  UNIQUE KEY uq_tipo_descricao (descricao)
);

-- 8) Tabela de Manutenções Realizadas
CREATE TABLE manutencao (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tipo_id INT NOT NULL,
  data DATE NOT NULL,
  local VARCHAR(100) NOT NULL,
  descricao TEXT,
  FOREIGN KEY (tipo_id) REFERENCES tipo_manutencao(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);

ALTER TABLE morador
ADD COLUMN responsavel_pelo_apartamento ENUM('Sim','Não') DEFAULT 'Não',
ADD COLUMN proprietario_do_apartamento ENUM('Sim','Não') DEFAULT 'Não',
ADD COLUMN possui_veiculo ENUM('Sim','Não') DEFAULT 'Não',
ADD COLUMN qtd_vagas_garagem TINYINT DEFAULT 0,
ADD COLUMN numero_vaga VARCHAR(50);

CREATE TABLE veiculo (
  id INT AUTO_INCREMENT PRIMARY KEY,
  morador_id INT NOT NULL,
  placa VARCHAR(10) NOT NULL,
  marca VARCHAR(50),
  modelo VARCHAR(50),
  FOREIGN KEY (morador_id) REFERENCES morador(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  UNIQUE KEY uq_placa (placa)
);


-- ============================================================
-- Inserções de exemplo para popular as tabelas do sistema

-- 1) Blocos
INSERT INTO bloco (descricao, qtde_apartamentos) VALUES
  ('Bloco A', 10),
  ('Bloco B', 8),
  ('Bloco C', 12);

-- 2) Apartamentos
INSERT INTO apartamento (numero, bloco_id, andar) VALUES
  ('101', 1, 1),
  ('102', 1, 1),
  ('201', 1, 2),
  ('101', 2, 1),
  ('201', 2, 2),
  ('301', 3, 3);

-- 3) Moradores
INSERT INTO morador (nome, cpf, telefone, apartamento_id) VALUES
  ('João Silva', '123.456.789-00', '(47) 99999-0000', 1),
  ('Maria Souza', '987.654.321-11', '(47) 98888-1111', 2),
  ('Carlos Pereira', '111.222.333-44', '(47) 97777-2222', 3);

-- 4) Referências de Pagamento
INSERT INTO referencia (mes, ano, valor, vencimento) VALUES
  (1, 2025, 350.00, '2025-01-10'),
  (2, 2025, 350.00, '2025-02-10'),
  (3, 2025, 350.00, '2025-03-10');

-- 5) Pagamentos
INSERT INTO pagamento (morador_id, referencia_id, data_pagamento, valor_pago) VALUES
  (1, 1, '2025-01-09', 350.00),
  (2, 1, '2025-01-08', 350.00);

-- 6) Tipos de Manutenção
INSERT INTO tipo_manutencao (descricao) VALUES
  ('Elétrica'),
  ('Hidráulica'),
  ('Pintura');

-- 7) Manutenções Realizadas
INSERT INTO manutencao (tipo_id, data, local, descricao) VALUES
  (1, '2025-03-15', 'Hall de entrada', 'Troca de lâmpadas queimadas'),
  (2, '2025-03-20', 'Calha externa', 'Desentupimento');
  
  

SELECT * FROM bloco;
SELECT * FROM apartamento;
SELECT * FROM morador;
USE websiteInfo;

CREATE TABLE IF NOT EXISTS imoveis (
    imoveisID INTEGER PRIMARY KEY AUTO_INCREMENT,
    tipo VARCHAR(50) NOT NULL,
    endereco VARCHAR(150) NOT NULL,
    numero VARCHAR(10) NOT NULL,
    bairro VARCHAR(50) NOT NULL,
    cidade VARCHAR(50) NOT NULL,
    cep VARCHAR(15) NOT NULL,
    quartos INTEGER NOT NULL, 
    banheiros INTEGER NOT NULL,
    descricao TEXT NOT NULL,
    preco_venda DECIMAL(10, 2) DEFAULT 0,
    preco_aluguel DECIMAL(10, 2) DEFAULT 0,
    tamanho DECIMAL(10, 2) DEFAULT 0,
    qualidade DECIMAL(3, 1) CHECK (qualidade <= 5.0) ,
    disponibilidade ENUM('venda', 'aluguel', 'venda_e_aluguel') NOT NULL
);
-- Adicionando 2 imóveis para venda
INSERT INTO imoveis (tipo, endereco, numero, bairro, cidade, cep, quartos, banheiros,  descricao, preco_venda, tamanho, qualidade, disponibilidade) 
VALUES 
('Casa', 'Rua das Flores', '123', 'Centro', 'São Paulo', '01000-000', 4, 3,
'Casa incrível com 4 quartos e 3 banheiros. Espaçosa e bem iluminada. Localizada no coração da cidade.', 
500000.00, 250, 3.5,  'venda');

INSERT INTO imoveis (tipo, endereco, numero, bairro, cidade, cep, quartos, banheiros, descricao, preco_venda, preco_aluguel, tamanho, qualidade, disponibilidade) 
VALUES 
('Apartamento', 'Avenida Atlântica', '456', 'Copacabana', 'Rio de Janeiro', '22000-000', 3, 2,
'Espetacular apartamento de frente para o mar, com 3 quartos e 2 banheiros. Totalmente mobiliado e decorado.', 
800000.00, 10000, 350, 5.0, 'venda_e_aluguel');

-- Adicionando 2 imóveis para aluguel
INSERT INTO imoveis (tipo, endereco, numero, bairro, cidade, cep, quartos, banheiros, descricao, preco_aluguel, tamanho, qualidade, disponibilidade) 
VALUES 
('Casa', 'Rua das Palmeiras', '789', 'Barra da Tijuca', 'Rio de Janeiro', '23000-000', 3, 2,
'Casa charmosa com 3 quartos e 2 banheiros. Área externa com jardim e churrasqueira.', 
8000, 100, 3.0, 'aluguel');

INSERT INTO imoveis (tipo, endereco, numero, bairro, cidade, cep, quartos, banheiros, descricao, preco_aluguel, tamanho, qualidade, disponibilidade) 
VALUES 
('Apartamento', 'Rua dos Girassóis', '101', 'Pinheiros', 'São Paulo', '05000-000', 2, 1,
'Apartamento aconchegante com 2 quartos e 1 banheiro. Próximo a mercados e restaurantes.', 
2000.00, 90, 4.0, 'aluguel');

-- Adicionando 2 imóveis para venda e aluguel
INSERT INTO imoveis (tipo,endereco, numero, bairro, cidade, cep, quartos, banheiros, descricao, preco_venda, tamanho, qualidade, disponibilidade) 
VALUES 
('Casa', 'Rua das Acácias', '456', 'Botafogo', 'Rio de Janeiro', '21000-000', 5, 4,
'Casa espaçosa e confortável com 5 quartos e 4 banheiros. Área externa com piscina e churrasqueira.', 
700000.00, 300, 5.0, 'venda');

INSERT INTO imoveis (tipo, endereco, numero, bairro, cidade, cep, quartos, banheiros, descricao, preco_venda, preco_aluguel, tamanho, qualidade, disponibilidade) 
VALUES 
('Apartamento', 'Avenida Paulista', '789', 'Bela Vista', 'São Paulo', '01300-000', 1, 1,
'Ótimo apartamento de 1 quarto e 1 banheiro. Próximo ao metrô e comércios.', 
400000.00, 15000, 200, 4.5,  'venda_e_aluguel');



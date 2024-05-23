USE websiteInfo;

CREATE TABLE IF NOT EXISTS clientes(
    clienteID INTEGER PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    senha VARCHAR(50) NOT NULL,
    cpf VARCHAR(50) NOT NULL,
    celular VARCHAR(25) NOT NULL
);

INSERT INTO clientes (  nome, email, senha, cpf) VALUES ('Roberto', 'ralves@gmail.com', '123456', '85923791256', '11953486834');

-- CREATE TABLE IF NOT EXISTS produtos

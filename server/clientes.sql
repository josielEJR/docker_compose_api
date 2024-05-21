USE websiteInfo;

CREATE TABLE IF NOT EXISTS clientes(
    clienteID integer PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    senha VARCHAR(50) NOT NULL,
    cpf VARCHAR(50) NOT NULL
);

INSERT INTO clientes ( clienteID, nome, email, senha, cpf) VALUES (001, 'Roberto', 'ralves@gmail.com', '123456', '85923791256');

-- CREATE TABLE IF NOT EXISTS produtos
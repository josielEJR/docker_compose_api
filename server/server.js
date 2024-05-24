const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mysql = require('mysql')

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())
// conexão com bancoo de dados 
const connection = mysql.createConnection({
    host: 'database',
    port: '3306',
    user: 'root',
    password: 'root',
    database: 'websiteInfo',
})
connection.connect(err => {
    if (err) {
        return console.log(err)
    }

    const port = 3000
    app.listen(port, () => { console.log('server started at port ' + port) })
    return console.log('connected to database with success!')
})
// conexão a tabela "clientes"
app.get('/', (req, res) => {
    connection.query(`SELECT * FROM clientes`, (err, results, fields) => {
        res.send(results)
    })
})
// rota para login 
app.post('/login', (req, res) => {

    const {email, senha} = req.body

    connection.query('SELECT * FROM clientes', (err, results, fields) => {
        let estaPresente = false
        results.forEach(val => {
            if (val.email === email && val.senha === senha) {
                estaPresente = true
            }
        })

        res.send(estaPresente)
    })
})
// rota para cadastrar clientes
app.post('/cadastrar', (req, res) => {

    const { nome, email, senha, cpf, celular } = req.body

    connection.query(`SELECT * FROM clientes`, (err, results, fields) => {
        let estaPresente = false
        results.forEach(val => {
            if (val.email === email || val.cpf === cpf) {
                estaPresente = true
            }
        })

        if (estaPresente) {
            res.send({ mensagem: "usuário ja esta cadastrado" })
        } else {
            connection.query(
                'INSERT INTO clientes (nome, email, senha, cpf, celular) VALUES (?, ?, ?, ?, ?)', [nome, email, senha, cpf, celular], (err, result) => {
                    if (err) {
                        console.log(err)
                    }
                    const newId = result.insertId
                    res.send({ userID: newId, nome, email, senha, cpf, celular })
                }
            )
        }
    })
})
// conexão com a tabela "imoveis"
app.get('/imoveis', (req, res) => {
    connection.query(`SELECT * FROM imoveis`, (err, results, fields) => {
        if (err) {
            console.error('Erro ao buscar infomações:', err)
            res.status(500).json({ error: 'Erro ao buscar informações no banco de dados'})
            return
        }

        res.json(results)
    })
})
// rota para adicionar imoveis 
app.post('/adicionar', (req, res) => {
    const { tipo, endereco, numero, bairro, cidade, cep, quartos, banheiros, descricao,  preco_venda, preco_aluguel, disponibilidade, qualidade, tamanho } = req.body
    // validar dados recebido {validação simples}
    if (!tipo || !endereco || !numero || !bairro || !cidade || !cep || !quartos || ! banheiros || !descricao || !preco_venda || !preco_aluguel || !disponibilidade || !qualidade || !tamanho ) {
        return res.status(400).json({ error: 'Todos os campos são obrigatorios'})
    }

    const imovel = {
        tipo,
        endereco,
        numero,
        bairro,
        cidade,
        cep,
        quartos: parseInt(quartos),
        banheiros: parseInt(banheiros), // Converter para número inteiro
        descricao,
        preco_aluguel: preco_aluguel === "null" || preco_aluguel === "0" ? null : parseFloat(preco_aluguel),
        preco_venda: preco_venda === "null" || preco_venda === "0" ? null : parseFloat(preco_venda),
        disponibilidade,
        qualidade,
        tamanho: parseFloat(tamanho)
    }
    connection.query('INSERT INTO imoveis SET ?', imovel, (err, result) => {
        if (err) {
            console.error('Erro ao cadastrar imóvel:', err)
            return res.status(500).json({ error: 'Erro ao cadastrar imóvel'})
        }
        const newId = result.insertId;
        console.log('Imóvel cadastrado com sucesso! ID:', newId);
        res.status(201).json({ id: newId, message: 'Imóvel cadastrado com sucesso!', imovel })
    })
}) 
// Rota para buscar imóveis
app.get('/imoveis/busca', (req, res) => {
    // Parâmetros para a busca
    const { tipo, bairro, cidade, quartos, banheiros, precoVendaMin, precoVendaMax, precoAluguelMin, precoAluguelMax, qualidadeMax, qualidadeMin } = req.query

    let sqlQuery = 'SELECT * FROM imoveis WHERE 1'

    if (tipo) {
        sqlQuery += ` AND tipo = '${tipo}'`
    }

    if (bairro) {
        sqlQuery += ` AND bairro = '${bairro}'`
    }

    if (cidade) {
        sqlQuery += ` AND cidade = '${cidade}'`
    }

    if (quartos) {
        sqlQuery += ` AND quartos = '${quartos}'`
    }

    if (banheiros) {
        sqlQuery += ` AND banheiros = '${banheiros}'`
    }

    if (precoVendaMin && precoVendaMax) {
        sqlQuery += ` AND preco_venda BETWEEN ${precoVendaMin} AND ${precoVendaMax}`
    } else if (precoVendaMin) {
        sqlQuery += ` AND preco_venda >= ${precoVendaMin}`
    } else if (precoVendaMax) {
        sqlQuery += ` AND preco_venda <= ${precoVendaMax}`
    }

    if (precoAluguelMin && precoAluguelMax) {
        sqlQuery += ` AND preco_aluguel BETWEEN ${precoAluguelMin} AND ${precoAluguelMax}`
    } else if (precoAluguelMin) {
        sqlQuery += ` AND preco_aluguel >= ${precoAluguelMin}`
    } else if (precoAluguelMax) {
        sqlQuery += ` AND preco_aluguel <= ${precoAluguelMax}`
    }
    if (qualidadeMin && qualidadeMax) {
        sqlQuery += ` AND qualidade BETWEEN ${qualidadeMin} AND ${qualidadeMax}`
    } else if (qualidadeMin) {
        sqlQuery += ` AND qualidade >= ${qualidadeMin}`
    } else if (qualidadeMax) {
        sqlQuery += ` AND qualidade <= ${qualidadeMax}`
    }

    connection.query(sqlQuery, (err, results) => {
        if (err) {
            console.error('Erro ao buscar imóveis:', err)
            return res.status(500).json({ error: 'Erro ao buscar imóveis'})
        }

        res.json(results)
    })
})


// Rota de deletar imóvel 
app.delete('/deletar/:id', (req, res) => {
    const imovelID = req.params.id
    // Verificar se o imovel com ID especificado existe
    connection.query('SELECT * FROM imoveis WHERE imoveisID = ?', imovelID, (err, results) => {
        if (err) {
            console.error('Erro ao buscar imóvel:', err)
            return res.status(500).json({ error: 'Erro ao bucar imóvel'})
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Imóvel não encontrado'})
        }
        // Se o imovel existe, executa aquery para deleta-lo
        connection.query('DELETE FROM imoveis WHERE imoveisID = ?', imovelID, (err, result) => {
            if (err) {
                console.error('Erro ao deletar imóvel:', err)
                return res.status(500).json({ error: 'Erro ao deletar imóvel' })
            }

            console.log('Imovel deletado com sucesso!')
            res.status(200).json({ message: 'Imovel deletado com sucesso!'})
        })
    })
})
// Rota de atualizar
app.put('/atualizar/:id', (req, res) => {
    const imovelID = req.params.id 
    // Parâmetros para atualizar
    const { tipo, endereco, numero, bairro, cidade, cep, quartos, banheiros, descricao, preco_venda,
        preco_aluguel, tamanho, qualidade, disponibilidade } = req.body

    if ( !tipo || !endereco || !numero || !bairro || !cidade || !cep || !quartos || !banheiros || !descricao || !preco_venda || !preco_aluguel || tamanho == null || !qualidade || !disponibilidade ) {
        return res.status(400).json({error: 'Todos os campos são obrigatorio'})
    }

    const imovelAtualizado = {
        tipo,
        endereco,
        numero,
        bairro,
        cidade,
        cep,
        quartos: parseInt(quartos),
        banheiros: parseInt(banheiros),
        descricao,
        preco_aluguel: preco_aluguel === "null" || preco_aluguel === "0" ? null : parseFloat(preco_aluguel),
        preco_venda: preco_venda === "null" || preco_venda === "0" ? null : parseFloat(preco_venda),
        qualidade,
        disponibilidade,
        tamanho: parseFloat(tamanho)
    }
    const sqlQuery = 'UPDATE imoveis SET ? WHERE imoveisID = ?'

    connection.query(sqlQuery, [imovelAtualizado, imovelID], (err, result) => {
        if (err) {
            console.error('Erro ao atulizar imóvel:', err)
            return res.status(500).json({ error:'Erro ao atulizar imóvel' })
        }
        if (result.affectedRows === 0){
            return res.status(404).json({ error: 'Imovel não encontrado' })
        }
        res.status(200).json({ message: 'Imovel atualizado com sucesso!', imovelAtualizado })
    })
})
// Rotas de disponibilidade {venda e aluguel }
// Rota para separar disponibilidade de venda
app.get('/imoveis/venda', (req, res) => {
    let sqlQuery = 'SELECT * FROM imoveis WHERE disponibilidade IN ("venda", "venda_e_aluguel")'

    connection.query(sqlQuery, (err, results) => {
        if (err) {
            console.error('Erro ao buscar imóvel para venda:', err)
            return res.status(500).json({ error: 'Erro ao buscar imóveis para a venda' })
        }
        res.json(results)
    })
})
// Rota para separar disponibilidade de aluguel
app.get('/imoveis/aluguel', (req, res) => {
    let sqlQuery = 'SELECT * FROM imoveis WHERE disponibilidade IN ("aluguel", "venda_e_aluguel")'

    connection.query(sqlQuery, (err, results) => {
        if (err) {
            console.error('Erro ao buscar imóvel para aluguel:', err)
            return res.status(500).json({ error: 'Erro ao buscar imóveis para a aluguel' })
        }
        res.json(results)
    })
})
// rota para pegar o imóvel pelo id 
router.get('/:id', (req, res ) => {
    const imovelID = req.params.id

    let sqlQuery = 'SELECT * FROM imoveis WHERE imoveisID = ?'
    connection.query(sqlQuery, [imovelID], (err, results) => {
        if (err) {
            console.error('Erro ao buscar imóvel por id:', err)
            return res.status(500).json({ error: 'Erro ao buscar imóveis por id ' })
        }
        res.json(results)
    })
})

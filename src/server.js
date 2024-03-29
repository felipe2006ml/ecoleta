const express = require('express')
const server = express()

// pegar o banco de dados
const db = require("./database/db")

// configurar pasta publica
server.use(express.static("public"))

// habilitar o uso do req.body na nossa aplicação
server.use(express.urlencoded({extended: true}))

// utilizando template engine
const nunjucks = require("nunjucks")

nunjucks.configure("src/views", {
    express: server,
    noCache: true
})

// configurar caminhos da minha aplicação
// pagina inicial
// req: requisicao
// res: resposta
server.get("/", function(req, res) {
    return res.render("index.njk")
})

server.get("/create-point", function(req, res) {

    // req.query: Query strings vindo da url
    // console.log(req.query)

    return res.render("create-point.njk")
})

server.post("/savepoint", function(req, res) {

    // req.body: o corpo do nosso formulario
    // console.log(req.body)

    // 2 - inserir dados na tabela
    const query = `
        INSERT INTO places (
            image,
            name,
            address,
            address2,
            state,
            city,
            items
        ) VALUES (?,?,?,?,?,?,?);
    `

    const values = [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items
    ];

    function afterInsertData(err) {
        if(err) {
            return console.log(err);
        }

        console.log("Cadastrado com sucesso");
        console.log(this);

        return res.render("create-point.njk", {saved: true})
    }

    db.run(query, values, afterInsertData)

})

server.get("/search-results", function(req, res) {

    const search = req.query.search

    if(search == "") {
        // pesquisa vazia
        return res.render("search-results.njk", {total: 0})
    }

    // pegar os dados do banco de dados
        db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows) {
            if(err) {
                return console.log(err)
            }

            const total = rows.length

            // mostrar a página html com os dados do banco de dados
            return res.render("search-results.njk", {places: rows, total: total})
        })
})

// ligar o servidor
server.listen(3000)
const express = require("express")
const server = express()

//pegar o banco de dados 
const db = require("./database/db")

//configurar pasta public
server.use(express.static("public"))

// habilitar o req.body na aplicacao
server.use(express.urlencoded({extended: true }))


//ultilizando teamplate diferante
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", { 
    express: server,
    noCache: true,
})


// configurar caminhos na aplicacao 
// pagina inicial (home)
// req = requisicao / res = resposta
server.get("/", (req, res) => {
   return res.render("index.html", { title: "Um titulo" } )

})
server.get("/create-point", (req, res) => {


  // req.query: query strings das url
  req.query

  return res.render("create-point.html")

})

server.post("/savepoint", (req, res) => {

  //req.body: O corpo do formulario 
  console.log(req.body)

  // Inserir dados no banco de dados 
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
  ]

  function afterInsertData(err) {
    if(err) {
        console.log(err)
        return res.send("Erro no cadastro!")
    }

    console.log("Cadastrado com sucesso!")
    console.log(this)

    return res.render("create-point.html", { saved: true })
    
  }

  db.run(query, values, afterInsertData) // Este e o db.run que esta inserindo dados 
    
})

server.get("/search", (req, res) => {

  const search = req.query.search

  if(search == "") {
    // pesquisa vazia 
    return res.render("search-results.html", {total: 0})
  }

  // pegar os dados do banco de dados 
  // pesquisar por cidade
  db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows) {
    if(err) {
        return console.log(err) 
    }


    const total = rows.length


    console.log("Aqui estão seus registros:")
    console.log(rows)
    // mostrar a pagina html com os dados do banco de dados 
    return res.render("search-results.html", { places: rows, total})
  })

  

})

// ligar o servidor 
server.listen(3000)
const express = require('express');
const app = express();
const port = 3000;
const mysql = require('mysql2');
const passport = require('passport');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const database = require('./db');
const loginRouter = require('./routes/login');
const cadastroRouter = require('./routes/cadastro');
const lutadorRouter = require('./routes/lutadores');
const http = require('http');
const formidable = require('formidable');
const fs = require('fs');
// Configuração do Express
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
//CRUD


//session´s

app.use(session({
    secret: 'rogertrabaio',
    resave: false,
    saveUninitialized: true,

}));





// Configuração de Sessão
const sessionStore = new MySQLStore({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '',
    database: 'node',
});
app.use(session({
    store: sessionStore,
    secret: '2C44-4D44-WppQ38S', // Configure um segredo seu aqui
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 60 * 1000 }, // 30 minutos
}));

// Configuração do Passport
require('./auth')(passport);
app.use(passport.initialize());
app.use(passport.session());

// Rota para página inicial
app.get('/', (req, res) => {
    res.render('home');
});

// Rota para página inicial
app.get('/home', (req, res) => {
    res.render('home');
});

// Rota para o formulário (substitua pelo seu arquivo de modelo)
app.get('/formulario', (req, res) => {
    res.render('formulario'); // Substitua 'formulario' pelo nome do seu arquivo de modelo
});

//rota para cadastro de lutadores



// Middleware de autenticação personalizado
function authenticationMiddleware(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login?erro=1');
}

// Roteadores
app.use('/login', loginRouter);
app.use('/cadastro', cadastroRouter);
app.use('/lutador', authenticationMiddleware, lutadorRouter);
// Inicialização do banco de dados

app.get('/logout', function(req, res, next){
    req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
    });
   });


//CRUD



app.get('/lutador', function(req, res) {
    var sql = "SELECT * FROM lutadores";
    con.query(sql, function(err, result, fields) {
      if (err) throw err;
      console.log(result); // Adicione este console log para verificar os dados recuperados
      res.render('GerenciadorLutadores.ejs', { lutadores: result });
    });
  });
  
   
   
   app.get('/inscricao',function(req,res){
    res.render('formLutadores.ejs');
   });

   app.post('/inscricao', function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
      if (err) throw err;
      var oldpath = files.imagem[0].filepath;
      var hash = crypto.createHash('md5').update(Date.now().toString()).digest('hex');
      var ext = path.extname(files.imagem[0].originalFilename);
      var nomeimg = hash + ext;
      var newpath = path.join(__dirname, 'public/imagens/', nomeimg);
      fs.rename(oldpath, newpath, function (err) {
        if (err) throw err;
      });
      var sql = "INSERT INTO lutadores (nome, nome_luta, idade, peso, imagem) VALUES ?";
      var values = [[fields['nome'][0], fields['nome_luta'][0], fields['idade'][0], fields['peso'][0], nomeimg]];
      con.query(sql, [values], function (err, result) {
        if (err) throw err;
        console.log("Número de registros inseridos: " + result.affectedRows);
        res.redirect('/lutadores');
      });
    });
  });
  
  app.get('/apagar/:id', function (req, res) {
    var id = req.params.id;
    var sql = "SELECT * FROM lutadores where id=?";
    con.query(sql, id, function (err, result, fields) {
      if (err) throw err;
      const img = path.join(__dirname, 'public/imagens/', result[0]['imagem']);
      fs.unlink(img, (err) => {
        if (err) throw err;
      });
    });
  
    var deleteSql = "DELETE FROM lutadores WHERE id = ?";
    con.query(deleteSql, id, function (err, result) {
      if (err) throw err;
      console.log("Número de registros apagados: " + result.affectedRows);
    });
    res.redirect('/lutador');
  });
  
  app.post('/editar/:id', function (req, res) {
    var id = req.params.id;
    var sql = "UPDATE lutadores SET nome = ?, nome_luta = ?, idade = ?, peso = ? WHERE id = ?";
    var values = [
      [req.body['nome']],
      [req.body['nome_luta']],
      [req.body['idade']],
      [req.body['peso']],
      [id]
    ];
    con.query(sql, values, function (err, result) {
      if (err) throw err;
      console.log("Número de registros alterados: " + result.affectedRows);
      res.redirect('/lutador');
    });
  });
  
  app.get('/editar/:id', function(req, res) {
    var sql = "SELECT * FROM lutadores where id=?";
    var id = req.params.id;
    con.query(sql, id, function(err, result, fields) {
      if (err) throw err;
      res.render('editar.ejs', { lutadores: result });
    });
  });

  


(async () => {
    try {
        const resultado = await database.sync();
    } catch (error) {
        console.log(error);
    }
})();


// Iniciar servidor
const server = app.listen(port, () => {
    console.log('Exemplo de aplicação escutando em http://localhost:' + port);
});

const express = require('express');
const mysql = require('mysql');
const formidable = require('formidable');
const session = require('express-session');
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const app = express();
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.use(express.static("public"));
app.use(session({
    secret: 'rogertrabaio',
    resave: false,
    saveUninitialized: true

}));

app.post('/cadastro', function (req, res) {
    bcrypt.hash(req.body['senha'], saltRounds, function (err, hash) {
        var sql = "INSERT INTO usuario (nome, email, senha) VALUES ?";
        var values = [
            [req.body['nome'], req.body['email'], hash]
        ];
        con.query(sql, [values], function (err, result) {
            if (err) throw err;
            console.log("Numero de registros inseridos: " + result.affectedRows);
        });
    });
    res.redirect('/login');
});

app.get('/cadastro', function (req, res) {
    res.render('cadastro.ejs');
});
app.get('/login', function (req, res) {
    res.render('login.ejs', { mensagem: "Realize o Login" });
});
app.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        // cannot access session here
    })
    res.redirect('/login');
});

app.post('/login', function (req, res) {
    var senha = req.body['senha'];
    var email = req.body['email']
    var sql = "SELECT * FROM usuario where email = ?";
    con.query(sql, [email], function (err, result) {
        if (err) throw err;
        if (result.length) {
            // método usado para comparar se a senha do banco é igual a uma passada
            bcrypt.compare(senha, result[0]['senha'], function (err, resultado) {
                if (err) throw err;
                if (resultado) {
                    req.session.loggedin = true;
                    req.session.username = result[0]['nome'];
                    res.redirect('/');
                }
                else { res.render('login', { mensagem: "Senha inválida" }) }
            });
        }
        else { res.render('login.ejs', { mensagem: "E-mail não encontrado" }) }
    });
})

// rota com controle de acesso somente se adiciona o if, dentro dele segue o
//comportamento normal, no else redireciona para a rota de login ou só mostra a tela
//de login com a mensagem
app.get('/adicionar', function (req, res) {
    if (req.session.loggedin) {
        res.render('adicionaProduto.ejs');
    } else {
        res.render('login.ejs', { mensagem: "Por favor realize o login para acessar a página" })
    }
});
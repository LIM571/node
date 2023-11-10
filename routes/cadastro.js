const bcrypt = require('bcryptjs');
const express = require('express');
const router = express.Router();
const Usuario = require("../model/usuario");
const app = express();

var saltRounds = 10;


// Rota para a página de cadastro
router.get('/cadastro', (req, res) => {
    res.render('cadastro');
});


router.get('/', function (req, res) {
    var mensagem = req.session.mensagem;
    req.session.mensagem = undefined
    res.render('cadastro.ejs', {mensagem: mensagem});
});
router.post('/', async function (req, res) {
    var resultado = await Usuario.findAll({
        where: {
            email: req.body.email
        }

    });
    if (!resultado.length) {
        bcrypt.hash(req.body['senha'], saltRounds, function (err, hash) {
            const resultadoCadastro = Usuario.create({
                nome: req.body['nome'],
                senha: hash,
                email: req.body['email']
            })
        });
        res.redirect('/login');

    }

    else {
        req.session.mensagem = "E-mail já cadastrado";
        res.redirect('/cadastro');

    }

});
module.exports = router;
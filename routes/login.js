const express = require('express');
const router = express.Router();
const passport = require('passport');
const app = express();


// Rota de autenticação de login
router.post('/login', passport.authenticate('local', {
    // successRedirect: '/lutadores',



    failureRedirect: '/login?erro=2'
}));

router.get('/login', (req, res) => {
    req.session.usuario = ['nome']; // Armazena o nome do usuário na sessão
    req.session.loggedin = true;
    req.session.username = [0]['nome'];
    if (req.session.loggedin) {
        // se entrou aqui é porque está logado
        res.render('GerenciadorLutadores');
    }
    else {
        // se entrou aqui é porque não está logado
        res.render("login")
    }
});



router.get('/', (req, res, next) => {
    if (req.query.erro == 1)
        res.render('login', { mensagem: 'É necessário realizar login' });
    else if (req.query.erro == 2)
        res.render('login', { mensagem: 'Email e/ou senha incorretos!' });
    else
        res.render('login', { mensagem: null });
});
router.post('/',
    passport.authenticate('local', {
        successRedirect: '/lutador', failureRedirect: '/login?erro=2'
    })
);
module.exports = router;
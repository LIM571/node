const express = require('express');
const session = require('express-session');
const app = express();

// Rota para encerrar a sessão
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

app.get('/logout', (req, res) => {
  // Use o método logout do Passport
  req.logout((err) => {
    if (err) {
      console.error('Erro ao encerrar sessão:', err);
    }
    req.session.destroy(); // Destrua a sessão
    res.render("login")

  });
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Erro ao encerrar sessão:', err);
      }
      res.send('Sessão encerrada com sucesso.');

    });
  });
  
const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;
const Usuario = require('./model/usuario');
const Lutador = require('./model/Lutador');

module.exports = function (passport) {
    async function findUser(email) {
      let dadosBanco = await Usuario.findAll({
        raw: true,
        where: {
          email: email,
        },
      });
      if (dadosBanco.length > 0) return dadosBanco[0];
      else return null;
    }
  
    passport.serializeUser((user, done) => {
      done(null, { nome: user.nome, id: user.id});
    });
  
    passport.deserializeUser(async (id, done) => {
      try {
        let user = await Usuario.findAll({
          where: {
            id: id
          }
        })
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    });
  
    passport.use(
      new LocalStrategy(
        { usernameField: "email", passwordField: "senha" },
        async (email, senha, done) => {
          try {
            const user = await findUser(email);
            // usuário inexistente
            if (!user) {
              return done(null, false);
            }
            // comparando as senhas
            const isValid = bcrypt.compareSync(senha, user.senha);
            if (!isValid) return done(null, false);
            return done(null, user);
          } catch (err) {
            done(err, false);
          }
        }
      )
    );
};

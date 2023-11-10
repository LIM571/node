const express = require('express');
const mysql = require('mysql');
const formidable = require('formidable');
const session = require('express-session');
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const app = express();
const router = express.Router();

// Rota para a página de lutadores
router.get('/', (req, res) => {
    res.render('GerenciadorLutadores');
});

router.post('/', (req, res) => {
    res.render('GerenciadorLutadores');
});
module.exports = router;
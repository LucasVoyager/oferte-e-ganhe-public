const express = require('express');
const path = require('path');
const router = express.Router();
const {login, logout, esqueciSenha, recuperarEmail} = require('../controller/authController')
const { verificaToken } = require('../middlewares/authMiddlewares');

router.post("/api/auth/login", login)

router.post("/api/auth/logout", logout)

router.post("/api/auth/esqueciSenha", esqueciSenha)

router.post("/api/requisitarSenhaEMail", recuperarEmail)

module.exports = router;
const bcrypt = require('bcryptjs')

async function hashSenha(senha) {
    const saltRounds = 10
    const hashedSenha = await bcrypt.hash(senha, saltRounds)
    return hashedSenha
}

async function compareSenha(senhaDigitada, senhaHashedBanco) {
    const senhaCorreta = await bcrypt.compare(senhaDigitada, senhaHashedBanco)
    return senhaCorreta
}

module.exports = {
    hashSenha,
    compareSenha
}
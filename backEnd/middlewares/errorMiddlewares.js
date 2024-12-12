module.exports = (err, req, res, next) => {
    console.error('Erro capturado pelo middleware', err)

    const status = err.status || 500

    const message = err.message

    res.status(status).json({
        sucess: false,
        message
    })
}
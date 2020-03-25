const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function(app) {
    const backHost = process.env.BACK_HOST
    if (!backHost) {
        throw Error('environment variable BACK_HOST doesn\'t exist')
    }

    const backPort = process.env.BACK_PORT
    if (!backPort) {
        throw Error('environment variable BACK_PORT doesn\'t exist')
    }

    app.use('/api', createProxyMiddleware(`http://${backHost}:${backPort}`))
}

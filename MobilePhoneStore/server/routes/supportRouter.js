const Router = require('express')
const router = new Router()
const supportController = require('../controllers/supportController')

router.get('/', (req, res) => {
    // Передача HTTP-запроса в WebSocket-контроллер
    supportController.handleWebSocketConnection(req, res);
  });

module.exports = router
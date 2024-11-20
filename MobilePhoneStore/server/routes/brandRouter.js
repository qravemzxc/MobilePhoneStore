const Router = require('express')
const router = new Router()
const brandController = require('../controllers/brandController')

router.post('/', brandController.create)
router.delete('/', brandController.delete)
router.get('/', brandController.getAll)
router.put('/', brandController.update)

module.exports = router
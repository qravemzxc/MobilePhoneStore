const Router = require('express')
const router = new Router()
const deviceController = require('../controllers/deviceController')

router.post('/', deviceController.create)
router.get('/', deviceController.getAll)
router.get('/:id', deviceController.getOne)
router.delete('/:id', deviceController.delete)
router.put('/:id', deviceController.update)
router.post('/payment',(req,res)=>{
    const totalamount=req.body.totalamount
    const token=req.body.token

    stripe.customers.create({
        email:token.email,
        source:token.id
      })
        .then(customer =>{
            stripe.chargees.create({
                amount:totalamount*100,
                currency:'usd',
                customer:customer.id,
                receipt_email:token.email
            })
        }).then(result=>res.status(200).send(result))
        .catch(error => console.error(error));
})
router.post('/purchase', deviceController.createPurchase);
module.exports = router
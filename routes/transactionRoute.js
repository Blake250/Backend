const express = require("express")
const { protect } = require("../middleware/authMiddleWare")
const { transferFund, verifyAccount,  getTransactions, depositFundStripe, webhook, depositWithFlw } = require("../controller/transactionController")
const router = express.Router()



router.post('/transferFund', express.json(),  protect, transferFund)
router.post('/verifyAccount', express.json(),  protect, verifyAccount)

router.get('/getTransactions', express.json(), protect, getTransactions)
router.post('/depositFundStripe', express.json(), protect, depositFundStripe)
router.get('/depositWithFlw', express.json(), protect, depositWithFlw)
//router.get('/transactions', express.json(), protect, transactions)
router.post('/webhook', express.raw({type: 'application/json'}), webhook)



module.exports = router
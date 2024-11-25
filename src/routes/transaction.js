const express = require('express');

const router = express.Router();

const transactionController = require('../controllers/transaction');
const auth = require('../middlewares/authentication');

router.post('/create', auth.ensureLogin, transactionController.createNewTransaction);
router.get('/history', auth.ensureLogin, transactionController.getAllTransactions);
// router.get('/history/:id', auth.ensureLogin, transactionController.getTransactionById);
router.get('/history/:account', auth.ensureLogin, transactionController.getAllTransactionByAccount);
// router.get('/history/:type', auth.ensureLogin, transactionController.getTransactionByType);
// router.get('/history/:category', auth.ensureLogin, transactionController.getTransactionByCategory);
// router.put('/update/:id', auth.ensureLogin, transactionController.updateTransaction);
// router.delete('/delete/:id', auth.ensureLogin, transactionController.deleteTransaction);

module.exports = router;
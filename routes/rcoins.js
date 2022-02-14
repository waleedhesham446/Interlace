const express = require('express');
const {
    getMyRCoinRecords,
    convert,
    getCashoutHistory,
    makeCashout
} = require('../controllers/rcoins');
const auth = require('../middlewares/auth');

const router = express.Router();

router.get('/records/:myId', getMyRCoinRecords);
router.post('/convert/:myId', auth, convert);
router.get('/cashout/history/:myId', getCashoutHistory);
router.post('/cashout/:myId', auth, makeCashout);

module.exports = router;
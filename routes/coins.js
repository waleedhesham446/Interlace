const express = require('express');
const {
    getMyCoinRecords,
    getAllOffers,
    buyCoins,
    watchVideo,
    referralSubmit,
    referralInfo
} = require('../controllers/coins');

const router = express.Router();

router.get('/records/:myId', getMyCoinRecords);
router.get('/offers/list', getAllOffers);
router.post('/recharge/:myId', buyCoins);
router.post('/video/:myId', watchVideo);
router.post('/referral/submit/:myId', referralSubmit);
router.get('/referral/info/:myId', referralInfo);

module.exports = router;
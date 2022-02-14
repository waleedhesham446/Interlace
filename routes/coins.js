const express = require('express');
const {
    getMyCoinRecords,
    getAllOffers,
    buyCoins,
    watchVideo,
    referralSubmit,
    referralInfo
} = require('../controllers/coins');
const auth = require('../middlewares/auth');

const router = express.Router();

router.get('/records/:myId', getMyCoinRecords);
router.get('/offers/list', getAllOffers);
router.post('/recharge/:myId', auth, buyCoins);
router.post('/video/:myId', auth, watchVideo);
router.post('/referral/submit/:myId', auth, referralSubmit);
router.get('/referral/info/:myId', referralInfo);

module.exports = router;
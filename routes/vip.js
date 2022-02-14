const express = require('express');
const {
    getAllVipPlans,
    buyVipPlan
} = require('../controllers/vip');
const auth = require('../middlewares/auth');

const router = express.Router();

router.get('/list', getAllVipPlans);
router.post('/buy/:offerId', auth, buyVipPlan);

module.exports = router;
const express = require('express');
const {
    getAllVipPlans,
    buyVipPlan
} = require('../controllers/vip');

const router = express.Router();

router.get('/list', getAllVipPlans);
router.post('/buy/:offerId', buyVipPlan);

module.exports = router;
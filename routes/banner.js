const express = require('express');
const { getAllBanners } = require('../controllers/banner');

const router = express.Router();

router.get('/list', getAllBanners);

module.exports = router;
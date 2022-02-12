const express = require('express');
const {
    getAllStickers,
    sendSticker
} = require('../controllers/stickers');

const router = express.Router();

router.get('/list', getAllStickers);
router.post('/:liveId/send/:myId', sendSticker);

module.exports = router;
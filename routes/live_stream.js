const express = require('express');
const {
    getAllLiveStreams,
    getWatchers,
    create,
    getComments,
    createComment,
    sendGift, 
    sendSticker
} = require('../controllers/live_stream');
const auth = require('../middlewares/auth');

const router = express.Router();

router.get('/list', getAllLiveStreams);
router.get('/:liveId/watchers', getWatchers);
router.post('/create', auth, create);
router.get('/:liveId/comments', getComments);
router.post('/:liveId/createComment', auth, createComment);

router.post('/:liveId/gift', auth, sendGift);
router.post('/:liveId/sticker', auth, sendSticker);

module.exports = router;
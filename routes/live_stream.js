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

const router = express.Router();

router.get('/list', getAllLiveStreams);
router.get('/:liveId/watchers', getWatchers);
router.post('/create', create);
router.get('/:liveId/comments', getComments);
router.post('/:liveId/createComment', createComment);

router.post('/:liveId/gift', sendGift);
router.post('/:liveId/sticker', sendSticker);

module.exports = router;
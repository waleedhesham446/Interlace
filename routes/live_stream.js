const express = require('express');
const {
    getAllLiveStreams,
    getWatchers,
    create,
    getComments,
    createComment
} = require('../controllers/user');

const router = express.Router();

router.get('/list', getAllLiveStreams);
router.get('/:liveId/watchers', getWatchers);
router.post('/create', create);
router.get('/:liveId/comments', getComments);
router.post('/:liveId/createComment', createComment);

module.exports = router;
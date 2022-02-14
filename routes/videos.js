const express = require('express');
const {
    getAllVideos,
    getVideoById,
    getMyVideos,
    getVideosOfPerson,
    createVideo,
    createComment,
    getCommentsOfVideo,
    likeVideo,
    unlikeVideo
} = require('../controllers/videos');
const auth = require('../middlewares/auth');

const router = express.Router();

router.get('/list/:myId', getAllVideos);
router.get('/:videoId', getVideoById);
router.get('/myVideos/:myId', getMyVideos);
router.get('/:hisId/list/:myId', getVideosOfPerson);
router.post('/create', auth, createVideo);
router.post('/:videoId/comment/create', auth, createComment);
router.get('/:videoId/comments', getCommentsOfVideo);
router.post('/:videoId/like/:myId', auth, likeVideo);
router.post('/:videoId/unlike/:myId', auth, unlikeVideo);

module.exports = router;
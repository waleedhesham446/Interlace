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

const router = express.Router();

router.get('/list/:myId', getAllVideos);
router.get('/:videoId', getVideoById);
router.get('/myVideos/:myId', getMyVideos);
router.get('/:hisId/list/:myId', getVideosOfPerson);
router.post('/create', createVideo);
router.post('/:videoId/comment/create', createComment);
router.get('/:videoId/comments', getCommentsOfVideo);
router.post('/:videoId/like/:myId', likeVideo);
router.post('/:videoId/unlike/:myId', unlikeVideo);

module.exports = router;
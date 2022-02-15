const express = require('express');
const multer = require("multer");
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
const { makeid } = require('../utilities');

const DIR = 'uploads/videos';
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const filename = file.originalname.toLowerCase().split(' ').join('-');
        const uniqueName = `${makeid(16)}_${filename}`;
        req.body.url = `/videos/${uniqueName}`;
        cb(null, uniqueName);
    },
});

const router = express.Router();

router.get('/list/:myId', getAllVideos);
router.get('/:videoId', getVideoById);
router.get('/myVideos/:myId', getMyVideos);
router.get('/:hisId/list/:myId', getVideosOfPerson);
router.post('/create', multer({ storage: storage }).single("video"), auth, createVideo);

router.post('/:videoId/comment/create', auth, createComment);
router.get('/:videoId/comments', getCommentsOfVideo);

router.post('/like/:myId', auth, likeVideo);
router.post('/unlike/:myId', auth, unlikeVideo);

module.exports = router;
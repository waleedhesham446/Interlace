const express = require('express');
const multer = require("multer");
const {
    getAllLiveStreams,
    getWatchers,
    create,
    getComments,
    createComment,
    sendGift, 
    sendSticker,
    joinLiveStream,
    leaveLiveStream
} = require('../controllers/live_stream');
const auth = require('../middlewares/auth');
const { makeid } = require('../utilities');

const DIR = 'uploads/images';
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const filename = file.originalname.toLowerCase().split(' ').join('-');
        const uniqueName = `${makeid(16)}_${filename}`;
        req.body.image = `/images/${uniqueName}`;
        cb(null, uniqueName);
    },
});

const router = express.Router();

router.get('/list', getAllLiveStreams);
router.get('/:liveId/watchers', getWatchers);
router.post('/create', multer({ storage: storage }).single("image"), auth, create);
router.get('/:liveId/comments', getComments);
router.post('/:liveId/createComment', auth, createComment);

router.post('/:liveId/gift', auth, sendGift);
router.post('/:liveId/sticker', auth, sendSticker);

router.post('/:liveId/join', auth, joinLiveStream);
router.post('/:liveId/leave', auth, leaveLiveStream);

module.exports = router;
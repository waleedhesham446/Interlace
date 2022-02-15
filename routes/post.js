const express = require('express');
const multer = require("multer");
const {
    getByPostId,
    getMyPosts,
    getPostsByType,
    getPostsOfUser,
    createPost,
    createComment,
    getCommentsOfPost,
    likePost,
    unlikePost
} = require('../controllers/post');
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

router.get('/:postId', getByPostId);
router.get('/myPosts/:myId', getMyPosts);
router.get('/list/:myId', getPostsByType);
router.get('/:hisId/list/:myId', getPostsOfUser)
router.post('/create', multer({ storage: storage }).single("image"), auth, createPost);

router.post('/:postId/comment/create', auth, createComment);
router.get('/:postId/comments', getCommentsOfPost);

router.post('/like/:myId', auth, likePost);
router.post('/unlike/:myId', auth, unlikePost);

module.exports = router;
const express = require('express');
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

const router = express.Router();

router.get('/:postId', getByPostId);
router.get('/myPosts/:myId', getMyPosts);
router.get('/list/:myId', getPostsByType);
router.get('/:hisId/list/:myId', getPostsOfUser)
router.post('/create', auth, createPost);

router.post('/:postId/comment/create', auth, createComment);
router.get('/:postId/comments', getCommentsOfPost);

router.post('/like/:myId', auth, likePost);
router.post('/unlike/:myId', auth, unlikePost);

module.exports = router;
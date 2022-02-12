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

const router = express.Router();

router.get('/:postId', getByPostId);
router.get('/myPosts/:myId', getMyPosts);
router.get('/list/:myId', getPostsByType);
router.get('/:hisId/list/:myId', getPostsOfUser)
router.post('/create', createPost);

router.post('/:postId/comment/create', createComment);
router.get('/:postId/comments', getCommentsOfPost);

router.post('/like/:myId', likePost);
router.post('/unlike/:myId', unlikePost);

module.exports = router;
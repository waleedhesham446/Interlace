const express = require('express');
const {
    getByPostId,
    getMyPosts,
    getPostsByType,
    getPostsOfUser,
    create
} = require('../controllers/post');

const router = express.Router();

router.get('/:postId', getByPostId);
router.get('/myPosts/:myId', getMyPosts);
router.get('/list/:myId', getPostsByType);
router.get('/:hisId/list/:myId', getPostsOfUser)
router.post('/create', create);

module.exports = router;
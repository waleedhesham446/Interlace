const express = require('express');
const {
    getAllFollowers,
    follow,
    unfollow
} = require('../controllers/fans');

const router = express.Router();

router.get('/list/:userId', getAllFollowers);
router.post('/follow/:myId', follow);
router.post('/unfollow/:myId', unfollow);

module.exports = router;
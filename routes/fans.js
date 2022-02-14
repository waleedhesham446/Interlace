const express = require('express');
const {
    getAllFollowers,
    follow,
    unfollow
} = require('../controllers/fans');
const auth = require('../middlewares/auth');

const router = express.Router();

router.get('/list/:userId', getAllFollowers);
router.post('/follow/:myId', auth, follow);
router.post('/unfollow/:myId', auth, unfollow);

module.exports = router;
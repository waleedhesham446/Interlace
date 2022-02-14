const express = require('express');
const {
    signup,
    login,
    logout,
    search,
    getByUserName,
    update,
    updatePicture
} = require('../controllers/user');
const auth = require('../middlewares/auth');

const router = express.Router();

router.post('/signup', signup);
router.get('/login', login);
router.get('/logout', logout);
router.get('/search/:myId', search);
router.get('/:username', getByUserName);    //  UP??
router.post('/update/:myId', auth, update);
router.post('/updatePicture/:myId', auth, updatePicture);

module.exports = router;
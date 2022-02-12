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

const router = express.Router();

router.post('/signup', signup);
router.get('/login', login);
router.get('/logout', logout);
router.get('/search/:myId', search);
router.get('/:username', getByUserName);    //  UP??
router.post('/update/:myId', update);
router.post('/updatePicture/:myId', updatePicture);

module.exports = router;
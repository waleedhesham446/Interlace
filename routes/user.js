const express = require('express');
const multer = require("multer");
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

router.post('/signup', multer({ storage: storage }).single("image"), signup);
router.post('/login', login);
router.get('/logout', logout);
router.get('/search/:myId', search);
router.get('/:username', getByUserName);
router.post('/update/:myId', auth, update);
router.post('/updatePicture/:myId', multer({ storage: storage }).single("image"), auth, updatePicture);

module.exports = router;
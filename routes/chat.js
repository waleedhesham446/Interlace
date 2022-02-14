const express = require('express');
const multer = require("multer");
const {
    getMyChats,
    getMessagesOfChat,
    sendMessage,
    createChat
} = require('../controllers/chat');
const auth = require('../middlewares/auth');
const { makeid } = require('../utilities');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const DIR = `uploads/${req.body.type}s`;
        console.log(DIR);
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const filename = file.originalname.toLowerCase().split(' ').join('-');
        const uniqueName = `${makeid(16)}_${filename}`;
        req.body.fileUrl = `/${req.body.type}s/${uniqueName}`;
        cb(null, uniqueName);
    },
});

const router = express.Router();

router.get('/list/:myId', getMyChats);
router.get('/:chatId/messages', getMessagesOfChat);
router.post('/:chatId/send', multer({ storage: storage }).single("file"), auth, sendMessage);
router.post('/create', auth, createChat);

module.exports = router;
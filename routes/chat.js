const express = require('express');
const {
    getMyChats,
    getMessagesOfChat,
    sendMessage,
    createChat
} = require('../controllers/chat');
const auth = require('../middlewares/auth');

const router = express.Router();

router.get('/list/:myId', getMyChats);
router.get('/:chatId/messages', getMessagesOfChat);
router.post('/:chatId/send', auth, sendMessage);
router.post('/create', auth, createChat);

module.exports = router;
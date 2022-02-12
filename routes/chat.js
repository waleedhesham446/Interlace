const express = require('express');
const {
    getMyChats,
    getMessagesOfChat,
    sendMessage,
    createChat
} = require('../controllers/chat');

const router = express.Router();

router.get('/list/:myId', getMyChats);
router.get('/:chatId/messages', getMessagesOfChat);
router.post('/:chatId/send', sendMessage);
router.post('/create', createChat);

module.exports = router;
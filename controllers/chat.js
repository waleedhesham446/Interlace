const { User } = require('../models/User');
const { Chat } = require('../models/Chat');
const { ChatMessage } = require('../models/ChatMessage');
const { Post } = require('../models/Post');
const { Video } = require('../models/Video');

const getMyChats = async (req, res) => {
    const { myId } = req.params;

    try {
        const user = await User.findById(myId);
        if(!user) return res.status(404).json({ message: 'This user is not registered' });

        const chats = [];

        const chats1 = await Chat.find({ firstUser: myId });
        let otherPersonsIds1 = chats1.map(chat => chat.secondUser);
        let otherPersons1 = await User.find({ _id: { $in: otherPersonsIds1 } }).select('-password');
        chats1.forEach((chat, i) => {
            chats.push({ 
                _id: chat._id,
                firstUser: chat.firstUser,
                secondUser: chat.secondUser,
                latestMessage: chat.latestMessage,
                latestMessageDate: chat.latestMessageDate,
                latestSenderId: chat.latestSenderId,
                otherUser: otherPersons1[i] 
            });
        });

        const chats2 = await Chat.find({ secondUser: myId });
        let otherPersonsIds2 = chats2.map(chat => chat.firstUser);
        let otherPersons2 = await User.find({ _id: { $in: otherPersonsIds2 } }).select('-password');
        chats2.forEach((chat, i) => {
            chats.push({
                _id: chat._id,
                firstUser: chat.firstUser,
                secondUser: chat.secondUser,
                latestMessage: chat.latestMessage,
                latestMessageDate: chat.latestMessageDate,
                latestSenderId: chat.latestSenderId,
                otherUser: otherPersons2[i]
            });
        });

        res.status(200).json(chats);
    } catch (error) {
        res.status(500).json(error);
    }
}

const getMessagesOfChat = async (req, res) => {
    const { chatId } = req.params;

    try {
        const chat = await Chat.findById(chatId);
        if(!chat) return res.status(404).json({ message: 'This chat does not exist' });

        const messages = await ChatMessage.find({ chatId });

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json(error);
    }
}

const sendMessage = async (req, res) => {
    const body = JSON.parse(JSON.stringify(req.body));
    const { chatId } = req.params;
    let { type, text, fileUrl, senderId, videoId, postId, actualEmail } = body;
    try {
        const user = await User.findById(senderId);
        if(!user) return res.status(404).json({ message: 'This user is not registered' });
        if(user.email != actualEmail) return res.status(401).json({ message: 'Unauthorized user' });

        const chat = await Chat.findById(chatId);
        if(!chat) return res.status(404).json({ message: 'This chat does not exist' });

        if(!text && !fileUrl && !videoId && !postId ) return res.status(410).json({ message: 'Invalid empty message' });

        let lastMsg = text;
        if(type === 'file') lastMsg = 'file';
        else if(type === 'voice') lastMsg = 'voice';
        else if(type === 'image') lastMsg = 'image';
        else if(type === 'videoShare'){
            const { url } = await Video.findById(videoId).select('+url');
            fileUrl = url;
            lastMsg = 'videoShare';
        }
        else if(type === 'postShare'){
            const { image } = await Post.findById(postId).select('+image');
            fileUrl = image;
            lastMsg = 'postShare';
        }
        const message = await ChatMessage.create({ chatId, type, text, fileUrl, senderId, videoId, postId });

        const updatedChat = await Chat.findByIdAndUpdate(chatId, { latestMessage: lastMsg, latestMessageDate: message.date, latestSenderId: senderId }, {new: true});

        res.status(200).json({ message, updatedChat });
    } catch (error) {
        res.status(500).json(error);
    }
}

const createChat = async (req, res) => {
    const { firstUser, secondUser, actualEmail } = req.body;

    try {
        if(firstUser == secondUser) return res.status(411).json({ message: 'Invalid chat between user and him/her-self' });
        const user1 = await User.findById(firstUser);
        const user2 = await User.findById(secondUser);
        if(!user1 || !user2) return res.status(404).json({ message: 'This user is not registered' });
        if(user1.email != actualEmail) return res.status(401).json({ message: 'Unauthorized user' });

        const chat = await Chat.findOne({ $or:[ { firstUser, secondUser }, { firstUser: secondUser, secondUser: firstUser } ] });
        if(chat) return res.status(410).json({ message: 'This chat already exists' });

        const newChat = await Chat.create({ firstUser, secondUser });

        res.status(200).json(newChat);
    } catch (error) {
        res.status(500).json(error);
    }
}

module.exports = { getMyChats, getMessagesOfChat, sendMessage, createChat };
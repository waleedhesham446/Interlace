const { User } = require('./models/User');
const { Sticker } = require('./models/Sticker');
const { ChatMessage } = require('./models/ChatMessage');
const { Post } = require('./models/Post');
const { Video } = require('./models/Video');

function socket_io_communication(io) {
    let onlineSockets = {};
    let liveStreamSockets = {};

    io.on("connection", (socket) => {
        socket.on('addMyCurrentSocketId', ({ id }) => {
            onlineSockets[socket.id] = id;
        });
        socket.on('enterLiveStream', async ({ liveId, id }) => {
            const user = await User.findById(id);
            delete user.password;
            if(!liveStreamSockets[liveId]) liveStreamSockets[liveId] = [];
            liveStreamSockets[liveId].forEach(id => {
                const sockId = Object.keys(onlineSockets).find(key => onlineSockets[key] === id);
                socket.broadcast.to(sockId).emit('newUserJoinStream', user);
            });
            liveStreamSockets[liveId].push(id);
        });
        socket.on('leaveLiveStream', async ({ liveId, id }) => {
            const user = await User.findById(id);
            delete user.password;
            if(!liveStreamSockets[liveId]) return;
            const index = liveStreamSockets[liveId].indexOf(id);
            if (index === -1) return;
            liveStreamSockets[liveId].splice(index, 1);
            liveStreamSockets[liveId].forEach(id => {
                const sockId = Object.keys(onlineSockets).find(key => onlineSockets[key] === id);
                socket.broadcast.to(sockId).emit('userLeaveStream', user);
            });
        });
        socket.on('makeLiveStreamComment', async ({ liveId, id, text }) => {
            const user = await User.findById(id);
            delete user.password;
            if(!liveStreamSockets[liveId]) return;
            liveStreamSockets[liveId].forEach(idLive => {
                if(idLive == id) return;
                const sockId = Object.keys(onlineSockets).find(key => onlineSockets[key] === idLive);
                socket.broadcast.to(sockId).emit('liveStreamComment', { user, text });
            });
        });
        socket.on('makeLiveStreamGift', async ({ liveId, senderId, receiverId, amount }) => {
            const user = await User.findById(senderId);
            delete user.password;
            if(!liveStreamSockets[liveId]) return;
            liveStreamSockets[liveId].forEach(idLive => {
                const sockId = Object.keys(onlineSockets).find(key => onlineSockets[key] === idLive);
                if(idLive == receiverId){
                    socket.broadcast.to(sockId).emit('liveStreamGiftReceived', { user, amount });
                    return;
                }
                socket.broadcast.to(sockId).emit('liveStreamGiftMade', { user, amount });
            });
        });
        socket.on('makeLiveStreamSticker', async ({ liveId, senderId, receiverId, stickerId }) => {
            const user = await User.findById(senderId);
            delete user.password;
            const sticker = await Sticker.findById(stickerId);
            if(!liveStreamSockets[liveId]) return;
            liveStreamSockets[liveId].forEach(idLive => {
                const sockId = Object.keys(onlineSockets).find(key => onlineSockets[key] === idLive);
                if(idLive == receiverId){
                    socket.broadcast.to(sockId).emit('liveStreamStickertReceived', { user, sticker });
                    return;
                }
                socket.broadcast.to(sockId).emit('liveStreamStickerSent', { user, sticker });
            });
        });
        socket.on('sendChatMessage', ({ chatId, receiverId, msgId }) => {
            const msg = await ChatMessage.findById(msgId);
            if(msg.type === 'videoShare'){
                const video = await Video.findById(msg.videoId);
                msg.video = video;
            }else if(msg.type === 'postShare'){
                const post = await Post.findById(msg.postId);
                msg.post = post;
            }
            const receiverSocketId = Object.keys(onlineSockets).find(key => onlineSockets[key] === receiverId);
            socket.broadcast.to(receiverSocketId).emit('chatMessageReceived', { chatId, senderId: onlineSockets[socket.id], msg });
        });
        socket.on("disconnect", () => {
            delete onlineSockets[socket.id];
        });
    });
}

module.exports = socket_io_communication;
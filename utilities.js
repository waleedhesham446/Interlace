const fs = require('fs');
const { User } = require('./models/User');
const { Sticker } = require('./models/Sticker');
const { ChatMessage } = require('./models/ChatMessage');
const { Post } = require('./models/Post');
const { Video } = require('./models/Video');
const { Story } = require('./models/Story');

let onlineSockets = {};
let liveStreamSockets = {};
let currentChallenges = {};

function socket_io_communication(io) {
    io.on("connection", (socket) => {
        socket.on('addMyCurrentSocketId', ({ id }) => {
            onlineSockets[socket.id] = id;
        });
        socket.on('enterLiveStream', async ({ liveId, id }) => {
            let user = await User.findById(id);
            user = user.toObject();
            delete user.password;
            if(!liveStreamSockets[liveId]){
                liveStreamSockets[liveId] = [];
                currentChallenges[liveId] = {};
            }
            liveStreamSockets[liveId].forEach(id => {
                const sockId = Object.keys(onlineSockets).find(key => onlineSockets[key] === id);
                socket.broadcast.to(sockId).emit('newUserJoinStream', user);
            });
            liveStreamSockets[liveId].push(id);
        });
        socket.on('leaveLiveStream', async ({ liveId, id }) => {
            let user = await User.findById(id);
            user = user.toObject();
            delete user.password;
            if(!liveStreamSockets[liveId]) return;
            const index = liveStreamSockets[liveId].indexOf(id);
            if (index === -1) return;
            liveStreamSockets[liveId].splice(index, 1);
            liveStreamSockets[liveId].forEach(id => {
                const sockId = Object.keys(onlineSockets).find(key => onlineSockets[key] === id);
                socket.broadcast.to(sockId).emit('userLeaveStream', user);
            });
            cleanUpAfterUserLeaveLiveStream(id, liveId, socket);
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
        socket.on('sendChatMessage', async({ chatId, receiverId, msgId }) => {
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
        socket.on('sendChallengeRequest', async ({ receiverId, liveId }) => {
            let senderId = onlineSockets[socket.id];
            if(!liveStreamSockets[liveId]){
                socket.emit('invalidChallenge', { message: 'This live stream does not exist' });
                return;
            }
            if(liveStreamSockets[liveId].indexOf(senderId) === -1 || liveStreamSockets[liveId].indexOf(receiverId) === -1){
                socket.emit('invalidChallenge', { message: 'You are not inside this live stream' });
                return;
            }
            for (const challengeId in currentChallenges[liveId]) {
                if(currentChallenges[liveId][challengeId].state === 'RUNNING'){
                    socket.emit('invalidChallenge', { message: 'There is a challenge running right now' });
                    return;
                }
            }
            const sender = await User.findById(senderId).select('-password');
            const receiver = await User.findById(receiverId).select('-password');
            let challengeId = makId(16);
            currentChallenges[liveId][challengeId] = {
                sender,
                receiver,
                state: 'PENDING',
            };
            liveStreamSockets[liveId].forEach(id => {
                const sockId = Object.keys(onlineSockets).find(key => onlineSockets[key] === id);
                if(id == senderId) return;
                if(id == receiverId){
                    socket.broadcast.to(sockId).emit('liveStreamChallengeReceived', { sender, challengeId });
                    return;
                }
                socket.broadcast.to(sockId).emit('liveStreamChallengeRequest', { sender, receiver });
            });
            socket.emit('requestSent', { message: `Your challenge request was sent, wait until ${receiver.username} responds` });
        });
        socket.on('responseChallengeRequest', ({ liveId, challengeId, accepted }) => {
            const receiverId = onlineSockets[socket.id];
            if(!liveStreamSockets[liveId]){
                socket.emit('invalidChallenge', { message: 'This live stream does not exist' });
                return;
            }
            if(liveStreamSockets[liveId].indexOf(receiverId) === -1){
                socket.emit('invalidChallenge', { message: 'You are not inside this live stream' });
                return;
            }
            if(!currentChallenges[liveId][challengeId]){
                socket.emit('invalidChallenge', { message: 'Wrong challenge id' });
                return;
            }
            if(currentChallenges[liveId][challengeId].receiver._id != receiverId){
                socket.emit('invalidChallenge', { message: 'You are not invited to this challenge' });
                return;
            }
            const senderId = currentChallenges[liveId][challengeId].sender._id;
            if(!accepted){
                const sockId = Object.keys(onlineSockets).find(key => onlineSockets[key] === senderId);
                socket.broadcast.to(sockId).emit('liveStreamChallengeRequestRefused');
                return;
            }
            currentChallenges[liveId][challengeId].state = 'RUNNING';
            for (const challengeId2 in currentChallenges[liveId]) {
                if(challengeId2 !== challengeId) delete currentChallenges[liveId][challengeId2];
            }
            liveStreamSockets[liveId].forEach(id => {
                const sockId = Object.keys(onlineSockets).find(key => onlineSockets[key] === id);
                if(id == receiverId) return;
                if(id == senderId){
                    socket.broadcast.to(sockId).emit('liveStreamChallengeStarted');
                    return;
                }
                socket.broadcast.to(sockId).emit('newLiveStreamStarted', {
                    sender: currentChallenges[liveId][challengeId].sender,
                    receiver: currentChallenges[liveId][challengeId].receiver
                });
            });
            socket.emit('liveStreamChallengeStarted');
            setTimeout(() => {
                if(!currentChallenges[liveId][challengeId]) return;
                const senderAfterChallenge = await User.findById(senderId).select('-password');
                const receiverAfterChallenge = await User.findById(receiverId).select('-password');
                const totalSender = senderAfterChallenge.coin + senderAfterChallenge.rCoin - currentChallenges[liveId][challengeId].sender.coin - currentChallenges[liveId][challengeId].sender.rCoin;
                const totalReceiver = receiverAfterChallenge.coin + receiverAfterChallenge.rCoin - currentChallenges[liveId][challengeId].receiver.coin - currentChallenges[liveId][challengeId].receiver.rCoin;
                if(totalSender > totalReceiver){
                    socket.emit('YouLostChallenge');
                    liveStreamSockets[liveId].forEach(id => {
                        const sockId = Object.keys(onlineSockets).find(key => onlineSockets[key] === id);
                        if(id == receiverId) return;
                        if(id == senderId){
                            socket.broadcast.to(sockId).emit('YouWonChallenge');
                            return;
                        }
                        socket.broadcast.to(sockId).emit('ChallengeEndedWithWinner', {
                            winner: currentChallenges[liveId][challengeId].sender,
                            loser: currentChallenges[liveId][challengeId].receiver
                        });
                    });
                }else if(totalSender < totalReceiver){
                    socket.emit('YouWonChallenge');
                    liveStreamSockets[liveId].forEach(id => {
                        const sockId = Object.keys(onlineSockets).find(key => onlineSockets[key] === id);
                        if(id == receiverId) return;
                        if(id == senderId){
                            socket.broadcast.to(sockId).emit('YouLostChallenge');
                            return;
                        }
                        socket.broadcast.to(sockId).emit('ChallengeEndedWithWinner', {
                            loser: currentChallenges[liveId][challengeId].sender,
                            winner: currentChallenges[liveId][challengeId].receiver
                        });
                    });
                }else {
                    socket.emit('YouDrawUpChallenge');
                    liveStreamSockets[liveId].forEach(id => {
                        const sockId = Object.keys(onlineSockets).find(key => onlineSockets[key] === id);
                        if(id == receiverId) return;
                        if(id == senderId){
                            socket.broadcast.to(sockId).emit('YouDrawUpChallenge');
                            return;
                        }
                        socket.broadcast.to(sockId).emit('ChallengeEndedWithDrawUp', {
                            user1: currentChallenges[liveId][challengeId].sender,
                            user2: currentChallenges[liveId][challengeId].receiver
                        });
                    });
                }
                delete currentChallenges[liveId][challengeId];
            }, 1000*60*5);
        });
        socket.on("disconnect", () => {
            const id = onlineSockets[socket.id];
            delete onlineSockets[socket.id];
            for (const liveId in liveStreamSockets) {
                if(liveStreamSockets[liveId].indexOf(id) === -1) return;
                cleanUpAfterUserLeaveLiveStream(id, liveId, socket);
            }
        });
    });
}

function cleanUpAfterUserLeaveLiveStream(id, liveId, socket) {
    for (const challengeId in currentChallenges[liveId]) {
        if(currentChallenges[liveId][challengeId].sender._id == id && currentChallenges[liveId][challengeId].state === 'RUNNING'){
            liveStreamSockets[liveId].forEach(idLive => {
                const sockId = Object.keys(onlineSockets).find(key => onlineSockets[key] === idLive);
                if(idLive == id) return;
                if(idLive == currentChallenges[liveId][challengeId].receiver._id){
                    socket.broadcast.to(sockId).emit('YourChallengeInturupted');
                    return;
                }
                socket.broadcast.to(sockId).emit('ChallengeInturupted');
            });
            delete currentChallenges[liveId][challengeId];
        }else if(currentChallenges[liveId][challengeId].receiver._id == id && currentChallenges[liveId][challengeId].state === 'RUNNING'){
            liveStreamSockets[liveId].forEach(idLive => {
                const sockId = Object.keys(onlineSockets).find(key => onlineSockets[key] === idLive);
                if(idLive == id) return;
                if(idLive == currentChallenges[liveId][challengeId].sender._id){
                    socket.broadcast.to(sockId).emit('YourChallengeInturupted');
                    return;
                }
                socket.broadcast.to(sockId).emit('ChallengeInturupted');
            });
            delete currentChallenges[liveId][challengeId];
        }
    }
}

function makeid (length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
}

function cleanUpOldStories(){
    setTimeout(async() => {
        const stories = await Story.find();
        const storiesFileNames = stories.map(story => story.fileUrl.slice(14));
        const existingImages = fs.readdirSync('./uploads/stories/images');
        const existingVideos = fs.readdirSync('./uploads/stories/videos');
        const existingAudios = fs.readdirSync('./uploads/stories/audios');
        existingImages.forEach(img => {
            if(storiesFileNames.indexOf(img) === -1) fs.unlinkSync(`./uploads/stories/images/${img}`);
        });
        existingVideos.forEach(video => {
            if(storiesFileNames.indexOf(video) === -1) fs.unlinkSync(`./uploads/stories/videos/${video}`);
        });
        existingAudios.forEach(audio => {
            if(storiesFileNames.indexOf(audio) === -1) fs.unlinkSync(`./uploads/stories/audios/${audio}`);
        });
    // }, 1000*60*60);
    }, 1000);
}

module.exports = { socket_io_communication, makeid, cleanUpOldStories };
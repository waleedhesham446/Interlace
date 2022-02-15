const ObjectId = require('mongoose').Types.ObjectId;
const { LiveStream } = require('../models/LiveStream');
const { LiveComment } = require('../models/LiveComment');
const { User } = require('../models/User');
const { CoinRecord } = require('../models/CoinRecord');
const { RCoinRecord } = require('../models/RCoinRecord');
const { Sticker } = require('../models/Sticker');

const getAllLiveStreams = async (req, res) => {
    try {
        const allLiveStreams = await LiveStream.find();
        res.status(200).json(allLiveStreams);
    } catch (error) {
        res.status(500).json(error);
    }
}

const getWatchers = async (req, res) => {
    const { liveId } = req.params;
    try {
        const { watchersIds } = await LiveStream.findById(liveId);
        let watchersList = await User.find({ _id: { $in: watchersIds } }).select('-password');
        res.status(200).json(watchersList);
    } catch (error) {
        res.status(500).json(error);
    }
}

const create = async (req, res) => {
    const body = JSON.parse(JSON.stringify(req.body));
    const { username, image, actualEmail } = body;
    try {
        const user = await User.findOne({ username });
        if(!user) return res.status(404).json({ message: 'This user is not registered' });
        if(user.email != actualEmail) return res.status(401).json({ message: 'Unauthorized user' });

        const newLive = await LiveStream.create({ username, country: user.country, image });
        const newLiveWithURL = await LiveStream.findByIdAndUpdate(newLive._id, { url: `${newLive._id}` }, {new: true});
        res.status(200).json(newLiveWithURL);
    } catch (error) {
        res.status(500).json(error);
    }
}

const getComments = async (req, res) => {
    const { liveId } = req.params;
    try {
        const comments = await LiveComment.aggregate([
            { $match: { postId: ObjectId(liveId) }},
            { $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "user"
            }},
            { "$project": { "user.password": 0 }},
        ]);
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json(error);
    }
}

const createComment = async (req, res) => {
    const { liveId } = req.params;
    const { myId, content, actualEmail } = req.body;
    try {
        const user = await User.findById(myId).select('-password');
        if(!user) return res.status(404).json({ message: 'This user is not registered' });
        if(user.email != actualEmail) return res.status(401).json({ message: 'Unauthorized user' });

        const live = await LiveStream.findById(liveId);
        if(!live) return res.status(404).json({ message: 'This live stream does not exist' });

        if(live.watchersIds.indexOf(myId) === -1) return res.status(410).json({ message: 'You are not watching this live stream' });
        
        if(!content) return res.status(411).json({ message: 'Invalid value' });

        let newComment = await LiveComment.create({ liveId, content, userId: myId });
        newComment = newComment.toObject();
        newComment.user = user;
        
        res.status(200).json(newComment);
    } catch (error) {
        res.status(500).json(error);
    }
}

const sendGift = async (req, res) => {
    const { liveId } = req.params;
    const { myId, hisId, amount } = req.query;
    const { actualEmail } = req.body;
    try {
        const me = await User.findById(myId);
        const him = await User.findById(hisId);
        if(!me || !him) return res.status(404).json({ message: 'This user is not registered' });
        if(me.email != actualEmail) return res.status(401).json({ message: 'Unauthorized user' });

        const live = await LiveStream.findById(liveId);
        if(!live) return res.status(404).json({ message: 'This live stream does not exist' });

        if(live.watchersIds.indexOf(myId) === -1 || live.watchersIds.indexOf(hisId) === -1) return res.status(410).json({ message: 'The sender and/or the receiver are/is not in this live stream' });
        
        if(amount <= 0) return res.status(410).json({ message: 'Invalid Value' });
        if(amount > me.coin) return res.status(411).json({ message: 'You do not have enough coins' });

        const meUpdated = await User.findByIdAndUpdate(myId, { $inc: { coin: -1*amount } }, {new: true}).select('-password');
        const himUpdated = await User.findByIdAndUpdate(hisId, { $inc: { coin: amount } }, {new: true}).select('-password');
        const myNewRecord = await CoinRecord.create({ userId: myId, amount, isIncrease: false, usageType: 'sendToHost' });
        const hisNewRecord = await CoinRecord.create({ userId: hisId, amount, isIncrease: true, by: me.username, usageType: 'liveGift' });
        const updatedLiveStream = await LiveStream.findByIdAndUpdate(liveId, { $inc: { coins: amount } }, {new: true});
        res.status(200).json({ meUpdated, himUpdated, myNewRecord, hisNewRecord, updatedLiveStream });
    } catch (error) {
        res.status(500).json(error);
    }
}

const sendSticker = async (req, res) => {
    const { liveId } = req.params;
    const { myId, hisId, stickerId } = req.query;
    const { actualEmail } = req.body;
    try {
        const me = await User.findById(myId);
        const him = await User.findById(hisId);
        if(!me || !him) return res.status(404).json({ message: 'This user is not registered' });
        if(me.email != actualEmail) return res.status(401).json({ message: 'Unauthorized user' });

        const live = await LiveStream.findById(liveId);
        if(!live) return res.status(404).json({ message: 'This live stream does not exist' });

        if(live.watchersIds.indexOf(myId) === -1 || live.watchersIds.indexOf(hisId) === -1) return res.status(410).json({ message: 'The sender and/or the receiver are/is not in this live stream' });
        
        const sticker = await Sticker.findById(stickerId);
        if(!sticker) return res.status(404).json({ message: 'This sticker does not exist' });

        if(sticker.price <= 0) return res.status(410).json({ message: 'Invalid Value' });
        if(sticker.price > me.coin) return res.status(411).json({ message: 'You do not have enough coins' });

        const meUpdated = await User.findByIdAndUpdate(myId, { $inc: { coin: -1*sticker.price } }, {new: true}).select('-password');
        const himUpdated = await User.findByIdAndUpdate(hisId, { $inc: { rCoin: sticker.price } }, {new: true}).select('-password');
        const myNewRecord = await CoinRecord.create({ userId: myId, amount: sticker.price, isIncrease: false, usageType: 'buySticker' });
        const hisNewRecord = await RCoinRecord.create({ userId: hisId, amount: sticker.price, isIncrease: true, by: me.username, usageType: 'liveGift' });
        const updatedLiveStream = await LiveStream.findByIdAndUpdate(liveId, { $inc: { stickers: 1, coins: sticker.price } }, {new: true});
        res.status(200).json({ meUpdated, himUpdated, myNewRecord, hisNewRecord, updatedLiveStream });
    } catch (error) {
        res.status(500).json(error);
    }
}

const joinLiveStream = async (req, res) => {
    const { liveId } = req.params;
    const { myId, actualEmail } = req.body;
    try {
        const user = await User.findById(myId).select('-password');
        if(!user) return res.status(404).json({ message: 'This user is not registered' });
        if(user.email != actualEmail) return res.status(401).json({ message: 'Unauthorized user' });

        const live = await LiveStream.findById(liveId);
        if(!live) return res.status(404).json({ message: 'This live stream does not exist' });

        if(live.watchersIds.indexOf(myId) !== -1) return res.status(410).json({ message: 'You are already inside this live stream' });
        const newLive = await LiveStream.findByIdAndUpdate(liveId, { $push: { watchersIds: myId  }, $inc: { watching: 1 } }, {new: true});
        res.status(200).json({ message: "You joind the live stream" });
    } catch (error) {
        res.status(500).json(error);
    }
}

const leaveLiveStream = async (req, res) => {
    const { liveId } = req.params;
    const { myId, actualEmail } = req.body;
    try {
        const user = await User.findById(myId).select('-password');
        if(!user) return res.status(404).json({ message: 'This user is not registered' });
        if(user.email != actualEmail) return res.status(401).json({ message: 'Unauthorized user' });

        const live = await LiveStream.findById(liveId);
        if(!live) return res.status(404).json({ message: 'This live stream does not exist' });

        if(live.watchersIds.indexOf(myId) === -1) return res.status(410).json({ message: 'You are not inside this live stream' });
        const newLive = await LiveStream.findByIdAndUpdate(liveId, { $pull: { watchersIds: myId  }, $inc: { watching: -1 } }, {new: true});
        res.status(200).json({ message: "You left the live stream" });
    } catch (error) {
        res.status(500).json(error);
    }
}

module.exports = { getAllLiveStreams, getWatchers, create, getComments, createComment, sendGift, sendSticker, joinLiveStream, leaveLiveStream };
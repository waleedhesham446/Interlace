const { LiveStream } = require('../models/LiveStream');
const { LiveComment } = require('../models/LiveComment');
const { User } = require('../models/User');

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
        let watchersList = await User.find({ _id: { $in: watchersIds } });
        watchersList.forEach(watcher => delete watcher.password);
        res.status(200).json(watchersList);
    } catch (error) {
        res.status(500).json(error);
    }
}

const create = async (req, res) => {
    const { watching, username, url, country, image, coins, stickers } = req.body;

    try {
        const newLive = await LiveStream.create({ watching, username, url, country, image, coins, stickers });
        res.status(200).json();
    } catch (error) {
        res.status(500).json(error);
    }
}

const getComments = async (req, res) => {
    const { liveId } = req.params;

    try {
        const comments = await LiveComment.find({ liveId });
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json(error);
    }
}

const createComment = async (req, res) => {
    const { liveId } = req.params;
    const { myId, content } = req.body;

    try {
        const user = await User.findById(myId);
        const newComment = await LiveComment.create({ liveId, content, user });

        res.status(200).json(newComment);
    } catch (error) {
        res.status(500).json(error);
    }
}

module.exports = { getAllLiveStreams, getWatchers, create, getComments, createComment };
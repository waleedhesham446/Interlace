const { User } = require('../models/User');
const { Story } = require('../models/Story');

const getStoryById = async (req, res) => {
    const { storyId } = req.params;
    try {
        const story = await Story.findById(storyId);
        res.status(200).json(story);
    } catch (error) {
        res.status(500).json(error);
    }
}

const getStoriesOfUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const story = await Story.find({ userId });
        res.status(200).json(story);
    } catch (error) {
        res.status(500).json(error);
    }
}

const getStoriesOfFollowings = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId);
        if(!user) return res.status(404).json({ message: 'This user is not registered' });

        const followingUsers = await User.find({ followersIds: userId });
        const followingUsersIds = followingUsers.map(followingUser => followingUser._id);
        const stories = await Story.aggregate([
            { $match: { userId: { $in: followingUsersIds } }},
            { $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "user"
            }},
            { "$project": { "user.password": 0 }},
        ]);
        const storiesGrouped = stories.reduce((r, a) => {
            r[a.userId] = r[a.userId] || [];
            r[a.userId].push(a);
            return r;
        }, Object.create(null));
        res.status(200).json(storiesGrouped);
    } catch (error) {
        res.status(500).json(error);
    }
}

const getStoriesOfFollowers = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId);
        if(!user) return res.status(404).json({ message: 'This user is not registered' });

        const { followersIds } = await User.findById(userId);
        const stories = await Story.aggregate([
            { $match: { userId: { $in: followersIds } }},
            { $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "user"
            }},
            { "$project": { "user.password": 0 }},
        ]);
        const storiesGrouped = stories.reduce((r, a) => {
            r[a.userId] = r[a.userId] || [];
            r[a.userId].push(a);
            return r;
        }, Object.create(null));
        res.status(200).json(storiesGrouped);
    } catch (error) {
        res.status(500).json(error);
    }
}

const getAllStories = async (req, res) => {
    try {
        const stories = await Story.aggregate([
            { $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "user"
            }},
            { "$project": { "user.password": 0 }},
        ]);
        const storiesGrouped = stories.reduce((r, a) => {
            r[a.userId] = r[a.userId] || [];
            r[a.userId].push(a);
            return r;
        }, Object.create(null));
        res.status(200).json(storiesGrouped);
    } catch (error) {
        res.status(500).json(error);
    }
}

const createStory = async (req, res) => {
    const body = JSON.parse(JSON.stringify(req.body));
    const { userId } = req.params;
    const { fileUrl, text, type, actualEmail, location } = body;
    try {
        const user = await User.findById(userId);
        if(!user) return res.status(404).json({ message: 'This user is not registered' });
        if(user.email != actualEmail) return res.status(401).json({ message: 'Unauthorized user' });

        if(!text && !fileUrl) return res.status(410).json({ message: 'Invalid empty story' });

        const story = await Story.create({ userId, fileUrl, text, type, location });
        
        res.status(200).json(story);
    } catch (error) {
        res.status(500).json(error);
    }
}

const removeStory = async (req, res) => {
    const { actualEmail } = req.body;
    const { storyId } = req.params;
    try {
        const user = await User.findOne({ email: actualEmail });
        if(!user) return res.status(404).json({ message: 'This user is not registered' });

        const story1 = await Story.find({ _id: storyId, userId: user._id });
        if(!story1) return res.status(401).json({ message: 'Unauthorized user' });

        const story = await Story.findByIdAndDelete(storyId);
        
        res.status(200).json(story);
    } catch (error) {
        res.status(500).json(error);
    }
}

module.exports = { getStoryById, getStoriesOfUser, getStoriesOfFollowings, getStoriesOfFollowers, getAllStories, createStory, removeStory };
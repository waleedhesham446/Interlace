const { User } = require('../models/User');
const { Video } = require('../models/Video');
const { VideoComment } = require('../models/VideoComment');

const getAllVideos = async (req, res) => {
    const { myId } = req.params;
    try {
        const user = await User.findById(myId);
        if(!user) return res.status(404).json({ message: 'This user is not registered' });

        const videos = await Video.find();
        const videosWithLikeFlag = videos.map((video) => {
            let iLiked = false;
            if(video.likersIds.indexOf(myId) !== -1) iLiked = true;
            return { video, iLiked };
        });

        res.status(200).json(videosWithLikeFlag);
    } catch (error) {
        res.status(500).json(error);
    }
}

const getVideoById = async (req, res) => {
    const { videoId } = req.params;
    const { myId } = req.query;
    try {
        const user = await User.findById(myId);
        if(!user) return res.status(404).json({ message: 'This user is not registered' });
        
        const video = await Video.findById(videoId);
        if(!video) return res.status(404).json({ message: 'This video does not exist' });

        let iLiked = false;
        if(video.likersIds.indexOf(myId) !== -1) iLiked = true;

        const videoWithLikeFlag = { iLiked, video };
        res.status(200).json(videoWithLikeFlag);
    } catch (error) {
        res.status(500).json(error);
    }
}

const getMyVideos = async (req, res) => {
    const { myId } = req.params;
    try {
        const user = await User.findById(myId);
        if(!user) return res.status(404).json({ message: 'This user is not registered' });
        
        const videos = await Video.find({ userId: myId });
        const videosWithLikeFlag = videos.map((video) => {
            let iLiked = false;
            if(video.likersIds.indexOf(myId) !== -1) iLiked = true;
            return { video, iLiked };
        });

        res.status(200).json(videosWithLikeFlag);
    } catch (error) {
        res.status(500).json(error);
    }
}

const getVideosOfPerson = async (req, res) => {
    const { hisId, myId } = req.params;
    try {
        const me = await User.findById(myId);
        const him = await User.findById(hisId);
        if(!me || !him) return res.status(404).json({ message: 'This user is not registered' });
        
        const videos = await Video.find({ userId: hisId });
        const videosWithLikeFlag = videos.map((video) => {
            let iLiked = false;
            if(video.likersIds.indexOf(myId) !== -1) iLiked = true;
            return { video, iLiked };
        });

        res.status(200).json(videosWithLikeFlag);
    } catch (error) {
        res.status(500).json(error);
    }
}

const createVideo = async (req, res) => {
    const body = JSON.parse(JSON.stringify(req.body));
    const { myId, description, url, actualEmail } = body;
    console.log(body);
    try {
        const user = await User.findById(myId);
        if(!user) return res.status(404).json({ message: 'This user is not registered' });
        if(user.email != actualEmail) return res.status(401).json({ message: 'Unauthorized user' });

        if(!url) return res.status(410).json({ message: 'Invalid value' });
        
        const video = await Video.create({ description, url, userId: myId });
        const updatedUser = await User.findByIdAndUpdate(myId, { $inc: { videos: 1 } }, {new: true});
        res.status(200).json(video);
    } catch (error) {
        res.status(500).json(error);
    }
}

const createComment = async (req, res) => {
    const { videoId } = req.params;
    const { content, myId, actualEmail } = req.body;
    try {
        const user = await User.findById(myId);
        if(!user) return res.status(404).json({ message: 'This user is not registered' });
        if(user.email != actualEmail) return res.status(401).json({ message: 'Unauthorized user' });

        const video = await Video.findById(videoId);
        if(!video) return res.status(404).json({ message: 'This video does not exist' });

        if(!content) return res.status(410).json({ message: 'Invalid value' });

        const comment = await VideoComment.create({ videoId, content, userId: myId });
        const updatedVideo = await Video.findByIdAndUpdate(videoId, { $inc: { commentsCount: 1 } }, {new: true});

        res.status(200).json({ comment, updatedVideo });
    } catch (error) {
        res.status(500).json(error);
    }
}

const getCommentsOfVideo = async (req, res) => {
    const { videoId } = req.params;
    try {
        const comments = await VideoComment.find({ videoId });
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json(error);
    }
}

const likeVideo = async (req, res) => {
    const { myId } = req.params;
    const { videoId } = req.query;
    const { actualEmail } = req.body;
    try {
        const user = await User.findById(myId);
        if(!user) return res.status(404).json({ message: 'This user is not registered' });
        if(user.email != actualEmail) return res.status(401).json({ message: 'Unauthorized user' });

        const video = await Video.findById(videoId);
        if(video.likersIds.indexOf(myId) !== -1) return res.status(410).json({ message: 'This user already liked this video' });

        const updatedVideo = await Video.findByIdAndUpdate(videoId, { $push: { likersIds: myId  }, $inc: { likesCount: 1 } }, {new: true});

        res.status(200).json(updatedVideo);
    } catch (error) {
        res.status(500).json(error);
    }
}

const unlikeVideo = async (req, res) => {
    const { myId } = req.params;
    const { videoId } = req.query;
    const { actualEmail } = req.body;
    try {
        const user = await User.findById(myId);
        if(!user) return res.status(404).json({ message: 'This user is not registered' });
        if(user.email != actualEmail) return res.status(401).json({ message: 'Unauthorized user' });

        const video = await Video.findById(videoId);
        if(video.likersIds.indexOf(myId) === -1) return res.status(410).json({ message: 'This user did not like this video' });

        const updatedVideo = await Video.findByIdAndUpdate(videoId, { $pull: { likersIds: myId  }, $inc: { likesCount: -1 } }, {new: true});

        res.status(200).json(updatedVideo);
    } catch (error) {
        res.status(500).json(error);
    }
}

module.exports = { getAllVideos, getVideoById, getMyVideos, getVideosOfPerson, createVideo, createComment, getCommentsOfVideo, likeVideo, unlikeVideo };
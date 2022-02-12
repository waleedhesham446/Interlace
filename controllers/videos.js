const { User } = require('../models/User');
const { Video } = require('../models/Video');
const { VideoComment } = require('../models/VideoComment');
const { post } = require('../routes/coins');

const getAllVideos = async (req, res) => {
    const { myId } = req.params;

    try {
        const user = await User.findById(myId);
        if(!user) return res.status(404).json({ message: 'This user is not registered' });

        const videos = await Video.find();
        const videosWithLikeFlag = videos.map((video) => {
            let iLiked = false;
            if(video.likersIds.indexOf(myId) !== -1) iLiked = true;
            delete video.user.password;
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
        delete video.user.password;

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
        
        const videos = await Video.find({ user });
        const videosWithLikeFlag = videos.map((video) => {
            let iLiked = false;
            if(video.likersIds.indexOf(myId) !== -1) iLiked = true;
            delete video.user.password;
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
        
        const videos = await Video.find({ user: him });
        const videosWithLikeFlag = videos.map((video) => {
            let iLiked = false;
            if(video.likersIds.indexOf(myId) !== -1) iLiked = true;
            delete video.user.password;
            return { video, iLiked };
        });

        res.status(200).json(videosWithLikeFlag);
    } catch (error) {
        res.status(500).json(error);
    }
}

const createVideo = async (req, res) => {
    const { description, url, myId } = req.params;

    try {
        const user = await User.findById(myId);
        if(!user) return res.status(404).json({ message: 'This user is not registered' });

        if(!url) return res.status(410).json({ message: 'Invalid value' });
        
        const video = await Video.create({ description, url, user });
        delete video.user.password;

        res.status(200).json(video);
    } catch (error) {
        res.status(500).json(error);
    }
}

const createComment = async (req, res) => {
    const { postId, content, myId } = req.params;

    try {
        const user = await User.findById(myId);
        if(!user) return res.status(404).json({ message: 'This user is not registered' });
        
        const video = await Video.findById(postId);
        if(!video) return res.status(404).json({ message: 'This video does not exist' });

        if(!content) return res.status(410).json({ message: 'Invalid value' });

        const comment = await VideoComment.create({ postId, content, user });
        const updatedVideo = await Video.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });
        delete comment.user.password;
        delete updatedVideo.user.password;

        res.status(200).json({ comment, updatedVideo });
    } catch (error) {
        res.status(500).json(error);
    }
}

const getCommentsOfVideo = async (req, res) => {
    const { videoId } = req.params;

    try {
        const comments = await VideoComment.find({ postId: videoId });
        const commentsWithoutUsersPasswords = comments.map((comment) => {
            delete comment.user.password;
            return comment;
        });
        res.status(200).json(commentsWithoutUsersPasswords);
    } catch (error) {
        res.status(500).json(error);
    }
}

const likeVideo = async (req, res) => {
    const { myId, videoId } = req.params;

    try {
        const user = await User.findById(myId);
        if(!user) return res.status(404).json({ message: 'This user is not registered' });

        const video = await Video.findById(videoId);
        if(video.likersIds.indexOf(myId) !== -1) return res.status(410).json({ message: 'This user already liked this video' });

        const updatedVideo = await Video.findByIdAndUpdate(videoId, { $push: { likersIds: myId  }, $inc: { likesCount: 1 } });
        delete updatedVideo.user.password;

        res.status(200).json(updatedVideo);
    } catch (error) {
        res.status(500).json(error);
    }
}

const unlikeVideo = async (req, res) => {
    const { myId, videoId } = req.params;

    try {
        const user = await User.findById(myId);
        if(!user) return res.status(404).json({ message: 'This user is not registered' });
        
        const video = await Video.findById(videoId);
        if(video.likersIds.indexOf(myId) === -1) return res.status(410).json({ message: 'This user did not like this video' });

        const updatedVideo = await Video.findByIdAndUpdate(postId, { $pull: { likersIds: myId  }, $inc: { likesCount: -1 } });
        delete updatedVideo.user.password;

        res.status(200).json(updatedVideo);
    } catch (error) {
        res.status(500).json(error);
    }
}

module.exports = { getAllVideos, getVideoById, getMyVideos, getVideosOfPerson, createVideo, createComment, getCommentsOfVideo, likeVideo, unlikeVideo };
const { User } = require('../models/User');
const { Post } = require('../models/Post');
const { PostComment } = require('../models/PostComment');

const getByPostId = async (req, res) => {
    const { postId } = req.params;
    const { myId } = req.query;

    try {
        const user = await User.findById(myId);
        if(!user) return res.status(404).json({ message: 'This user is not registered' });

        const post = await Post.findById(postId);
        let didILike = false;
        if(post.likersIds.indexOf(myId) !== -1) didILike = true;

        res.status(200).json({ didILike, post });
    } catch (error) {
        res.status(500).json(error);
    }
}

const getMyPosts = async (req, res) => {
    const { myId } = req.params;

    try {
        const user = await User.findById(myId);
        if(!user) return res.status(404).json({ message: 'This user is not registered' });

        const posts = await Post.find({ user });
        let postsWithLikeFlag = posts.map((post) => {
            let didILike = false;
            if(post.likersIds.indexOf(myId) !== -1) didILike = true;
            return { didILike, post };
        });

        res.status(200).json(postsWithLikeFlag);
    } catch (error) {
        res.status(500).json(error);
    }
}

const getPostsByType = async (req, res) => {
    const { myId } = req.params;
    const { type } = req.query;

    try {
        const user = await User.findById(myId);
        if(!user) return res.status(404).json({ message: 'This user is not registered' });

        const posts = await Post.find({ user });
        let postsWithLikeFlag = posts.map((post) => {
            let didILike = false;
            if(post.likersIds.indexOf(myId) !== -1) didILike = true;
            return { didILike, post };
        });

        res.status(200).json(postsWithLikeFlag);
    } catch (error) {
        res.status(500).json(error);
    }
}

const getPostsOfUser = async (req, res) => {
    const { hisId, myId } = req.params;

    try {
        const user = await User.findById(myId);
        if(!user) return res.status(404).json({ message: 'This user is not registered' });

        const posts = await Post.find({ user: { hisId } });
        let postsWithLikeFlag = posts.map((post) => {
            let didILike = false;
            if(post.likersIds.indexOf(myId) !== -1) didILike = true;
            return { didILike, post };
        });

        res.status(200).json(postsWithLikeFlag);
    } catch (error) {
        res.status(500).json(error);
    }
}

const createPost = async (req, res) => {
    const { location, caption, image, allowComments, hashtag, privacy, myId } = req.body;

    try {
        const user = await User.findById(myId);
        if(!user) return res.status(404).json({ message: 'This user is not registered' });

        const post = await Post.create({ location, caption, image, allowComments, hashtag, privacy, user });
        
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json(error);
    }
}

const createComment = async (req, res) => {
    const { postId } = req.params;
    const { content, myId } = req.body;

    try {
        const user = await User.findById(myId);
        if(!user) return res.status(404).json({ message: 'This user is not registered' });
        
        if(!content) return res.status(410).json({ message: 'Invalid value' });
        
        const comment = await PostComment.create({ postId, content, user });
        
        const post = await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });

        res.status(200).json(comment);
    } catch (error) {
        res.status(500).json(error);
    }
}

const getCommentsOfPost = async (req, res) => {
    const { postId } = req.params;

    try {
        const comments = await PostComment.find({ postId });
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json(error);
    }
}

const likePost = async (req, res) => {
    const { myId } = req.params;
    const { postId } = req.query;

    try {
        const user = await User.findById(myId);
        if(!user) return res.status(404).json({ message: 'This user is not registered' });

        const post1 = await Post.findById(postId);
        if(post1.likersIds.indexOf(myId) !== -1) return res.status(410).json({ message: 'This user already liked this post' });

        const post = await Post.findByIdAndUpdate(postId, { $push: { likersIds: myId  }, $inc: { likesCount: 1 } });

        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json(error);
    }
}

const unlikePost = async (req, res) => {
    const { myId } = req.params;
    const { postId } = req.query;

    try {
        const user = await User.findById(myId);
        if(!user) return res.status(404).json({ message: 'This user is not registered' });
        
        const post1 = await Post.findById(postId);
        if(post1.likersIds.indexOf(myId) === -1) return res.status(410).json({ message: 'This user did not like this post' });

        const post = await Post.findByIdAndUpdate(postId, { $pull: { likersIds: myId  }, $inc: { likesCount: -1 } });

        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json(error);
    }
}

module.exports = { getByPostId, getMyPosts, getPostsByType, getPostsOfUser, createPost, createComment, getCommentsOfPost, likePost, unlikePost };
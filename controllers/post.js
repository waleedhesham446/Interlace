const { User } = require('../models/User');
const { Post } = require('../models/Post');

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

const create = async (req, res) => {
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

module.exports = { getByPostId, getMyPosts, getPostsByType, getPostsOfUser, create };
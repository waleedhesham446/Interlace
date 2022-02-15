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

        const posts = await Post.find({ userId: myId });
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
    const { type, page } = req.query;
    try {
        const user = await User.findById(myId);
        if(!user) return res.status(404).json({ message: 'This user is not registered' });
        let posts;
        if(type === 'Following'){
            const followingUsers = await User.find({ followersIds: myId });
            const followingUsersIds = followingUsers.map(followingUser => followingUser._id);
            const notSortedPosts = await Post.find({ userId: { $in: followingUsersIds } }).sort({ time : -1});
            posts = notSortedPosts.reverse();
        }else if(type === 'Popular'){
            const notSortedPosts = await Post.find();
            posts = notSortedPosts.sort((postA, postB) => (postA.commentsCount + postA.likesCount) > (postB.commentsCount + postB.likesCount));
        }else if(type === 'Latest'){
            const notSortedPosts = await Post.find().sort({ time : -1});
            posts = notSortedPosts.reverse();
        }else{
            return res.status(410).json({ message: 'Invalid posts type' });
        }
        if(!posts.length) return res.status(200).json({ message: `Your ${type} posts is empty` });

        let startIndex = (page-1)*12;
        let endIndex = startIndex+12-1;
        if(startIndex+1 > posts.length) return res.status(411).json({ message: 'Invalid page' });
        if(endIndex+1 > posts.length) endIndex = posts.length - 1;

        const postsOfPage = posts.slice(startIndex, endIndex+1);
        let postsWithLikeFlag = postsOfPage.map((post) => {
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

        const posts = await Post.find({ userId: hisId });
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
    const body = JSON.parse(JSON.stringify(req.body));
    const { location, caption, image, allowComments, hashtag, privacy, myId, actualEmail } = body;
    try {
        const user = await User.findById(myId);
        if(!user) return res.status(404).json({ message: 'This user is not registered' });
        if(user.email != actualEmail) return res.status(401).json({ message: 'Unauthorized user' });

        if(!caption && !image) return res.status(410).json({ message: 'Invalid empty post' });

        const post = await Post.create({ location, caption, image, allowComments, hashtag, privacy, userId: myId });
        const updatedUser = await User.findByIdAndUpdate(myId, { $inc: { posts: 1 } }, {new: true}).select('-password');
        
        res.status(200).json({ post, updatedUser });
    } catch (error) {
        res.status(500).json(error);
    }
}

const createComment = async (req, res) => {
    const { postId } = req.params;
    const { content, myId, actualEmail } = req.body;
    try {
        const user = await User.findById(myId);
        if(!user) return res.status(404).json({ message: 'This user is not registered' });
        if(user.email != actualEmail) return res.status(401).json({ message: 'Unauthorized user' });

        if(!content) return res.status(410).json({ message: 'Invalid value' });
        
        const comment = await PostComment.create({ postId, content, userId: myId });
        
        const post = await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } }, {new: true});

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
    const { actualEmail } = req.body;
    try {
        const user = await User.findById(myId);
        if(!user) return res.status(404).json({ message: 'This user is not registered' });
        if(user.email != actualEmail) return res.status(401).json({ message: 'Unauthorized user' });

        const post1 = await Post.findById(postId);
        if(post1.likersIds.indexOf(myId) !== -1) return res.status(410).json({ message: 'This user already liked this post' });

        const post = await Post.findByIdAndUpdate(postId, { $push: { likersIds: myId  }, $inc: { likesCount: 1 } }, {new: true});

        res.status(200).json(post);
    } catch (error) {
        res.status(500).json(error);
    }
}

const unlikePost = async (req, res) => {
    const { myId } = req.params;
    const { postId } = req.query;
    const { actualEmail } = req.body;
    try {
        const user = await User.findById(myId);
        if(!user) return res.status(404).json({ message: 'This user is not registered' });
        if(user.email != actualEmail) return res.status(401).json({ message: 'Unauthorized user' });

        const post1 = await Post.findById(postId);
        if(post1.likersIds.indexOf(myId) === -1) return res.status(410).json({ message: 'This user did not like this post' });

        const post = await Post.findByIdAndUpdate(postId, { $pull: { likersIds: myId  }, $inc: { likesCount: -1 } }, {new: true});

        res.status(200).json(post);
    } catch (error) {
        res.status(500).json(error);
    }
}

module.exports = { getByPostId, getMyPosts, getPostsByType, getPostsOfUser, createPost, createComment, getCommentsOfPost, likePost, unlikePost };
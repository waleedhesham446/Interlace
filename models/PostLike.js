const mongoose = require('mongoose');
const { userSchema } = require('./User.js');

const postLikeSchema = mongoose.Schema({
    postId: { 
		type: mongoose.Schema.Types.ObjectId,
		required: true,
	},
    user: {
        type: userSchema,
        required: true,
    }
});

const PostLike = mongoose.model('PostLike', postLikeSchema);

module.exports = { postLikeSchema, PostLike };
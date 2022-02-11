const mongoose = require('mongoose');
const { userSchema } = require('./User.js');

const postCommentSchema = mongoose.Schema({
    postId: { 
		type: mongoose.Schema.Types.ObjectId,
		required: true,
	},
    content: { 
		type: String,
		required: true,
	},
    date: { 
		type: Date,
        required: false,
        default: new Date(),
	},
    user: {
        type: userSchema,
        required: true,
    }
});

const PostComment = mongoose.model('PostComment', postCommentSchema);

module.exports = { postCommentSchema, PostComment };
const mongoose = require('mongoose');

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
        required: true,
        default: new Date(),
	},
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
});

const PostComment = mongoose.model('PostComment', postCommentSchema);

module.exports = { postCommentSchema, PostComment };
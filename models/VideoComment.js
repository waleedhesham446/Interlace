const mongoose = require('mongoose');
const { userSchema } = require('./User.js');

const videoCommentSchema = mongoose.Schema({
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
    },
});

const VideoComment = mongoose.model('VideoComment', videoCommentSchema);

module.exports = { videoCommentSchema, VideoComment };
const mongoose = require('mongoose');

const videoCommentSchema = mongoose.Schema({
    videoId: { 
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

const VideoComment = mongoose.model('VideoComment', videoCommentSchema);

module.exports = { videoCommentSchema, VideoComment };
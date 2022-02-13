const mongoose = require('mongoose');

const videoSchema = mongoose.Schema({
    description: { 
		type: String,
		required: false,
	},
    likesCount: { 
        type: Number,
        required: true,
        default: 0,
        min: 0,
    },
    commentsCount: { 
		type: Number,
		required: true,
        default: 0,
        min: 0,
	},
    url: { 
		type: String,
		required: true,
	},
    date: { 
		type: Date,
        required: true,
        default: new Date(),
	},
	likersIds: {
        type: [mongoose.Schema.Types.ObjectId],
		required: false,
        default: [],
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
});

const Video = mongoose.model('Video', videoSchema);

module.exports = { videoSchema, Video };
const mongoose = require('mongoose');
const { userSchema } = require('./User.js');

const videoSchema = mongoose.Schema({
    description: { 
		type: String,
		required: false,
	},
    likesCount: { 
        type: Number,
        required: true,
        default: 0,
    },
    commentsCount: { 
		type: Number,
		required: true,
        default: 0,
	},
    url: { 
		type: String,
		required: false,
	},
	likersIds: {
        type: [mongoose.Schema.Types.ObjectId],
		required: false,
        default: [],
    },
    user: {
        type: userSchema,
        required: true,
    },
});

const Video = mongoose.model('Video', videoSchema);

module.exports = { videoSchema, Video };
const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    location: { 
		type: String,
		required: false,
	},
    time: { 
		type: Date,
        required: true,
        default: new Date(),
	},
    caption: { 
		type: String,
		required: false,
	},
    image: { 
		type: String,
		required: false,
	},
    commentsCount: { 
		type: Number,
		required: true,
        default: 0,
		min: 0,
	},
    likesCount: { 
		type: Number,
		required: true,
        default: 0,
		min: 0,
	},
    allowComments: { 
		type: Boolean,
		required: true,
        default: true,
	},
    hashtag: { 
		type: String,
		required: false,
	},
    privacy: { 
		type: String,
		required: true,
        enum: ['everyone', 'followers', 'onlyMe'],
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

const Post = mongoose.model('Post', postSchema);

module.exports = { postSchema, Post };
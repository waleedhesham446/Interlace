const mongoose = require('mongoose');
const { userSchema } = require('./User.js');

const postSchema = mongoose.Schema({
    location: { 
		type: String,
		required: true,
	},
    time: { 
		type: Date,
        required: false,
        default: new Date(),
	},
    caption: { 
		type: String,
		required: true,
	},
    image: { 
		type: String,
		required: true,
	},
    commentsCount: { 
		type: Number,
		required: false,
        default: 0,
	},
    likesCount: { 
		type: Number,
		required: false,
        default: 0,
	},
    allowComments: { 
		type: Boolean,
		required: false,
        default: true,
	},
    hashtag: { 
		type: String,
		required: true,
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
    user: {
        type: userSchema,
        required: true,
    }
});

const Post = mongoose.model('Post', postSchema);

module.exports = { postSchema, Post };
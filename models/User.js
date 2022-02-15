const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: { 
		type: String,
		required: true,
	},
    image: { 
		type: String,
		required: true,
	},
    email: { 
		type: String,
		required: true,
	},
    password: { 
		type: String,
		required: true,
	},
    username: { 
		type: String,
		required: true,
	},
    country: { 
		type: String,
		required: true,
	},
    bio: { 
		type: String,
		required: true,
	},
    level: { 
		type: Number,
		required: true,
        default: 1,
		min: 1,
		max: 5,
	},
    followers: { 
		type: Number,
		required: true,
        default: 0,
		min: 0,
	},
    followersIds: { 
		type: [mongoose.Schema.Types.ObjectId],
		required: true,
        default: [],
	},
    fans: { 
		type: Number,
		required: true,
        default: 0,
		min: 0,
	},
    videos: { 
		type: Number,
		required: true,
        default: 0,
		min: 0,
	},
    age: { 
		type: Number,
		required: true,
		min: 10,
	},
    posts: { 
		type: Number,
		required: true,
        default: 0,
		min: 0,
	},
    coin: { 
		type: Number,
		required: true,
		default: 0,
		min: 0,
	},
    rCoin: { 
		type: Number,
		required: true,
		default: 0,
		min: 0,
	},
    gender: {
		type: String,
		required: true,
		enum: ['male', 'female'],
	},
    isVip: { 
		type: Boolean,
		required: true,
        default: false,
	},
    isDocumented: { 
		type: Boolean,
		required: true,
        default: false,
	},
});

const User = mongoose.model('User', userSchema);

module.exports = { userSchema, User };
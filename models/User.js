const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    id: { 
		type: Number,
		required: true,
	},
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
		required: false,
        default: 0,
	},
    followers: { 
		type: Number,
		required: false,
        default: 0,
	},
    fans: { 
		type: Number,
		required: false,
        default: 0,
	},
    videos: { 
		type: Number,
		required: false,
        default: 0,
	},
    age: { 
		type: Number,
		required: true,
	},
    posts: { 
		type: Number,
		required: false,
        default: 0,
	},
    coin: { 
		type: Number,
		required: true,
	},
    rCoin: { 
		type: Number,
		required: true,
	},
    gender: {
		type: String,
		required: true,
		enum: ['male', 'female'],
	},
    isVip: { 
		type: Boolean,
		required: false,
        default: false,
	}
});

const User = mongoose.model('User', userSchema);

module.exports = { userSchema, User };
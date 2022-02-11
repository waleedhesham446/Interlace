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
		required: true,
	},
    followers: { 
		type: Number,
		required: true,
	},
    fans: { 
		type: Number,
		required: true,
	},
    videos: { 
		type: Number,
		required: true,
	},
    age: { 
		type: Number,
		required: true,
	},
    posts: { 
		type: Number,
		required: true,
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
		required: true,
        default: false,
	}
});

const User = mongoose.model('User', userSchema);

module.exports = User;
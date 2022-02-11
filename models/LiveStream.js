const mongoose = require('mongoose');

const liveStreamSchema = mongoose.Schema({
    watching: { 
		type: Number,
		required: false,
        default: 0,
	},
    username: { 
        type: String,
        required: true,
    },
    url: { 
        type: String,
        required: true,
    },
    country: { 
        type: String,
        required: true,
    },
    image: { 
		type: String,
		required: true,
	},
    coins: { 
		type: Number,
		required: true,
	},
    stickers: { 
		type: Number,
		required: true,
	},
});

const LiveStream = mongoose.model('LiveStream', liveStreamSchema);

module.exports = { liveStreamSchema, LiveStream };
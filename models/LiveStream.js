const mongoose = require('mongoose');

const liveStreamSchema = mongoose.Schema({
    watchersIds: {
        type: [mongoose.Schema.Types.ObjectId],
		required: false,
        default: [],
    },
    watching: { 
		type: Number,
		required: true,
        default: 0,
        min: 0,
	},
    username: { 
        type: String,
        required: true,
    },
    url: { 
        type: String,
        required: false,
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
        default: 0,
        min: 0,
	},
    stickers: { 
		type: Number,
		required: true,
        default: 0,
        min: 0,
	},
});

const LiveStream = mongoose.model('LiveStream', liveStreamSchema);

module.exports = { liveStreamSchema, LiveStream };
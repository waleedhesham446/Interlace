const mongoose = require('mongoose');

const liveCommentSchema = mongoose.Schema({
    liveId: { 
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

const LiveComment = mongoose.model('LiveComment', liveCommentSchema);

module.exports = { liveCommentSchema, LiveComment };
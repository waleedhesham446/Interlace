const mongoose = require('mongoose');
const { userSchema } = require('./User.js');

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
        required: false,
        default: new Date(),
	},
    user: {
        type: userSchema,
        required: true,
    },
});

const LiveComment = mongoose.model('LiveComment', liveCommentSchema);

module.exports = { liveCommentSchema, LiveComment };
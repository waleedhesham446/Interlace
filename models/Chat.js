const mongoose = require('mongoose');
const { userSchema } = require('./User.js');

const chatSchema = mongoose.Schema({
    firstUser: { 
		// type: mongoose.Schema.Types.ObjectId,
		type: Number,
		required: true,
	},
    secondUser: { 
		// type: mongoose.Schema.Types.ObjectId,
		type: Number,
		required: true,
	},
    latestMessage: { 
		type: String,
		required: true,
	},
    latestMessageDate: { 
		type: Date,
        required: true,
	},
    latestSenderId: { 
		type: mongoose.Schema.Types.ObjectId,
		required: true,
	},
    user: {
        type: userSchema,
        required: true,
    }
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = { chatSchema, Chat };
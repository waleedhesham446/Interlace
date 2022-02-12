const mongoose = require('mongoose');

const chatSchema = mongoose.Schema({
    firstUser: { 
		type: mongoose.Schema.Types.ObjectId,
		required: true,
	},
    secondUser: { 
		type: mongoose.Schema.Types.ObjectId,
		required: true,
	},
    latestMessage: { 
		type: String,
		required: false,
	},
    latestMessageDate: { 
		type: Date,
        required: false,
	},
    latestSenderId: { 
		type: mongoose.Schema.Types.ObjectId,
		required: false,
	},
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = { chatSchema, Chat };
const mongoose = require('mongoose');

const chatMessageSchema = mongoose.Schema({
    chatId: { 
		type: mongoose.Schema.Types.ObjectId,
		required: true,
	},
    type: { 
		type: String,
		required: true,
        enum: ['text', 'file', 'voice', 'image'],
	},
    text: { 
		type: String,
		required: true,
	},
    fileUrl: { 
		type: String,
		required: false,
	},
    date: { 
		type: Date,
        required: false,
        default: new Date(),
	},
    senderId: { 
		type: mongoose.Schema.Types.ObjectId,
		required: true,
	},
});

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

module.exports = { chatMessageSchema, ChatMessage };
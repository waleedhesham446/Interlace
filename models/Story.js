const mongoose = require('mongoose');

const storySchema = mongoose.Schema({
    userId: { 
		type: mongoose.Schema.Types.ObjectId,
		required: true,
	},
    fileUrl: { 
		type: String,
		required: false,
	},
    text: { 
		type: String,
		required: false,
	},
    type: {
		type: String,
		required: true,
		enum: ['video', 'image', 'audio', 'text'],
	},
	location: { 
		type: String,
		required: false,
	},
    date: { 
		type: Date,
        required: true,
        default: new Date(),
	},
});

const Story = mongoose.model('Story', storySchema);

module.exports = { storySchema, Story };
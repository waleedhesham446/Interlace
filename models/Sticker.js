const mongoose = require('mongoose');

const stickerSchema = mongoose.Schema({
    type: {
		type: String,
		required: true,
		enum: ['sticker', 'emoji', 'love'],
	},
    price: { 
		type: Number,
		required: false,
        default: 0,
	},
    isNew: { 
        type: Boolean,
        required: false,
        default: true,
    },
    url: { 
		type: String,
		required: true,
	},
});

const Sticker = mongoose.model('Sticker', stickerSchema);

module.exports = { stickerSchema, Sticker };
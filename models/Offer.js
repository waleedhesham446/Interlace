const mongoose = require('mongoose');

const offerSchema = mongoose.Schema({
    coins: { 
		type: Number,
		required: true,
		min: 1,
	},
    price: { 
		type: Number,
		required: true,
		min: 1,
	},
    discount: { 
		type: Number,
		required: false,
        default: 0,
		min: 0,
	},
});

const Offer = mongoose.model('Offer', offerSchema);

module.exports = { offerSchema, Offer };
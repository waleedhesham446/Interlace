const mongoose = require('mongoose');

const offerSchema = mongoose.Schema({
    coins: { 
		type: Number,
		required: true,
	},
    price: { 
		type: Number,
		required: true,
	},
    discount: { 
		type: Number,
		required: false,
        default: 0,
	},
});

const Offer = mongoose.model('Offer', offerSchema);

module.exports = { offerSchema, Offer };
const mongoose = require('mongoose');

const cashoutSchema = mongoose.Schema({
    amount: { 
		type: Number,
		required: true,
		min: 1,
	},
    date: { 
		type: Date,
        required: true,
        default: new Date(),
	},
    method: {
		type: String,
		required: true,
		enum: ['PAYTM', 'UPI', 'BANK'],
	},
    status: {
		type: String,
		required: true,
		enum: ['PENDING', 'COMPLETED'],
		default: 'PENDING',
	},
});

const Cashout = mongoose.model('Cashout', cashoutSchema);

module.exports = { cashoutSchema, Cashout };
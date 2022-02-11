const mongoose = require('mongoose');

const cashoutSchema = mongoose.Schema({
    amount: { 
		type: Number,
		required: true,
	},
    date: { 
		type: Date,
        required: false,
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
	},
});

const Cashout = mongoose.model('Cashout', cashoutSchema);

module.exports = { cashoutSchema, Cashout };
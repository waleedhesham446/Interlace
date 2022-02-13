const mongoose = require('mongoose');

const rCoinRecordSchema = mongoose.Schema({
    userId: { 
		type: mongoose.Schema.Types.ObjectId,
		required: true,
	},
    amount: { 
		type: Number,
		required: true,
		min: 1,
	},
    isIncrease: { 
		type: Boolean,
		required: true,
	},
    by: { 
		type: String,
		required: false,
	},
    usageType: {
		type: String,
		required: true,
		enum: ['convertToCoin', 'recharge', 'cashout'],
	},
});

const RCoinRecord = mongoose.model('RCoinRecord', rCoinRecordSchema);

module.exports = { rCoinRecordSchema, RCoinRecord };
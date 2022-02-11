const mongoose = require('mongoose');

const rCoinRecordSchema = mongoose.Schema({
    userId: { 
		type: mongoose.Schema.Types.ObjectId,
		required: true,
	},
    amount: { 
		type: Number,
		required: false,
        default: 0,
	},
    isIncrease: { 
		type: Boolean,
		required: false,
        default: false,
	},
    by: { 
		type: String,
		required: true,
	},
    usageType: {
		type: String,
		required: true,
		enum: ['convertToCoin', 'recharge', 'cashout'],
	},
});

const RCoinRecord = mongoose.model('RCoinRecord', rCoinRecordSchema);

module.exports = { rCoinRecordSchema, RCoinRecord };
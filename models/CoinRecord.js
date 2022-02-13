const mongoose = require('mongoose');

const coinRecordSchema = mongoose.Schema({
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
		enum: ['liveGift', 'watchingVideo', 'referral', 'RcoinConvertion', 'rechargeCoin', 'sendToHost', 'buySticker'],
	},
});

const CoinRecord = mongoose.model('CoinRecord', coinRecordSchema);

module.exports = { coinRecordSchema, CoinRecord };
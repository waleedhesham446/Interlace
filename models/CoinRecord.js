const mongoose = require('mongoose');

const coinRecordSchema = mongoose.Schema({
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
		enum: ['liveGift', 'watchingVideo', 'referral', 'RcoinConvertion', 'rechargeCoin', 'sendToHost', 'buySticker'],
	},
});

const CoinRecord = mongoose.model('CoinRecord', coinRecordSchema);

module.exports = { coinRecordSchema, CoinRecord };
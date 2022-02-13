const mongoose = require('mongoose');

const referralInfoSchema = mongoose.Schema({
    myReferralCode: { 
		type: mongoose.Schema.Types.ObjectId,
		required: true,
	},
    myReferralsCount: { 
		type: Number,
		required: true,
        default: 0,
	},
});

const ReferralInfo = mongoose.model('ReferralInfo', referralInfoSchema);

module.exports = { referralInfoSchema, ReferralInfo };
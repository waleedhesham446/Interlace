const mongoose = require('mongoose');

const referralInfoSchema = mongoose.Schema({
    myReferralCode: { 
		type: String,
		required: true,
	},
    myReferralsCount: { 
		type: Number,
		required: false,
        default: 0,
	},
});

const ReferralInfo = mongoose.model('ReferralInfo', referralInfoSchema);

module.exports = { referralInfoSchema, ReferralInfo };
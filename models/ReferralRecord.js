const mongoose = require('mongoose');

const referralRecordSchema = mongoose.Schema({
    newUserId: { 
		type: mongoose.Schema.Types.ObjectId,
		required: true,
	},
    newUserName: { 
		type: String,
		required: true,
	},
    oldUserId: { 
		type: mongoose.Schema.Types.ObjectId,
		required: true,
	},
    oldUserName: { 
		type: String,
		required: true,
	},
});

const ReferralRecord = mongoose.model('ReferralRecord', referralRecordSchema);

module.exports = { referralRecordSchema, ReferralRecord };
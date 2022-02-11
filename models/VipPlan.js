const mongoose = require('mongoose');

const vipPlanSchema = mongoose.Schema({
    title: { 
		type: String,
		required: true,
	},
    description: { 
		type: String,
		required: true,
	},
    days: { 
		type: Number,
		required: true,
	},
    price: { 
		type: Number,
		required: true,
	},
    auto_renew: { 
		type: Boolean,
		required: false,
        default: false,
	},
});

const VipPlan = mongoose.model('VipPlan', vipPlanSchema);

module.exports = { vipPlanSchema, VipPlan };
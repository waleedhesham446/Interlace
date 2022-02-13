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
		min: 1,
	},
    price: { 
		type: Number,
		required: true,
		min: 1,
	},
    auto_renew: { 
		type: Boolean,
		required: true,
        default: false,
	},
});

const VipPlan = mongoose.model('VipPlan', vipPlanSchema);

module.exports = { vipPlanSchema, VipPlan };
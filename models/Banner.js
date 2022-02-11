const mongoose = require('mongoose');

const bannerSchema = mongoose.Schema({
    image: { 
		type: String,
		required: true,
	},
    url: { 
		type: String,
		required: true,
	},
    isVip: { 
		type: Boolean,
		required: false,
        default: false,
	}
});

const Banner = mongoose.model('Banner', bannerSchema);

module.exports = { bannerSchema, Banner };
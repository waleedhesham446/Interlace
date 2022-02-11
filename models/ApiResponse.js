const mongoose = require('mongoose');

const apiResponseSchema = mongoose.Schema({
    code: { 
		type: Number,
		required: true,
	},
    type: { 
		type: String,
		required: true,
	},
    message: { 
		type: String,
		required: true,
	},
});

const ApiResponse = mongoose.model('ApiResponse', apiResponseSchema);

module.exports = { apiResponseSchema, ApiResponse };
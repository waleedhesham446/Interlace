const mongoose = require('mongoose');
const { userSchema } = require('./User.js');

const userSearchResultSchema = mongoose.Schema({
    mytId: { 
		type: mongoose.Schema.Types.ObjectId,
		required: true,
	},
    user: {
        type: userSchema,
        required: true,
    }
});

const UserSearchResult = mongoose.model('UserSearchResult', userSearchResultSchema);

module.exports = { userSearchResultSchema, UserSearchResult };
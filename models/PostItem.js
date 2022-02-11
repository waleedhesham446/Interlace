const mongoose = require('mongoose');
const { postSchema } = require('./Post.js');

const postItemSchema = mongoose.Schema({
    didILike: { 
		type: Boolean,
		required: true,
	},
    post: {
        type: postSchema,
        required: true
    }
});

const PostItem = mongoose.model('PostItem', postItemSchema);

module.exports = { postItemSchema, PostItem };
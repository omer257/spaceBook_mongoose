var mongoose = require('mongoose');

// design the two schema below and use sub docs to define the relationship
// between posts and comments you don't need a comments collection you only need
// a posts collection

var commentSchema = mongoose.Schema({text: String, user: String});

var postSchema = mongoose.Schema({text: String, comments: [commentSchema]});

var Post = mongoose.model('Post', postSchema);

module.exports = Post

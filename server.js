var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/spacebookDB', function () {
  console.log("DB connection established!!!");
})

var Post = require('./models/postModel');

var app = express();
app.use(express.static('public'));
app.use(express.static('node_modules'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// You will need to create 5 server routes These will define your API: 1) to
// handle getting all posts and their comments
app.get('/api', function (req, res) {
  Post
    .find(function (err, item) {
      if (err) 
        return console.error(err);
      res.json(item);
    })
});
// 2) to handle adding a post
app.post('/api/addPost', function (req, res) {
  var post1 = new Post(req.body);
  post1.save(function (err, item) {
    if (err) 
      return console.error(err);
    res.send(item);
  });

});

// 3) to handle deleting a post
app.delete('/api/post/:postid', function (req, res) {
  Post
    .findByIdAndRemove(req.params.postid, function (err, item) {
      if (err) 
        return res.send(err);
      res.send(item);
    })
});

// 4) to handle adding a comment to a post
app.post('/api/addComment', function (req, res) {
  res.send(req.body);
  Post.findById(req.body['_id'], function (err, Post) {
    if (err) 
      return console.log(err);
    Post
      .comments
      .push({user: req.body['data[user]'], text: req.body['data[text]']});
    Post.save(function (err, updatedTank) {
      if (err) 
        return console.log(err);
      }
    );
  });
});
// 5) to handle deleting a comment from a post
app.delete('/api/post/:postid/comment/:commentid', function (req, res) {

  Post
    .findById(req.params.postid, function (err, Post) {
      if (err) 
        return console.log(err);
      var currentPost = Post.comments;
      res.send(currentPost);
      Post
        .comments
        .splice(req.params.commentid, 1);
      Post.save(function (err, updatedTank) {
        if (err) 
          return console.log(err);
        }
      );
    });

});

app.listen(8000, function () {
  console.log("what do you want from me! get me on 8000 ;-)");
});
